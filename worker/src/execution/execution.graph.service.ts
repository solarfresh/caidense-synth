import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';
import { LLMCallExecutor } from '@caidense/reasoning/executor/genai/genai.service';
import { ConditionExecutor } from '@caidense/reasoning/executor/generic/condition.service';
import { ScriptExecutor } from '@caidense/reasoning/executor/generic/script.service';
import { SwitchExecutor } from '@caidense/reasoning/executor/generic/switch.service';
import { ExecutionGraph, ExecutionGraphConfig } from '@caidense/reasoning/graph/graph.interface';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker, InMemoryExecutionContextStore } from '@caidense/reasoning/state/state.service';
import { ReasoningThinkingDto } from '@caidense/reasoning/thinking/dto/thinking.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { GraphTraversalEngine } from '../traverse/traverse.service';


const ExcutorMap: Record<ExecutionNodeType, any> = {
  [ExecutionNodeType.CONDITION]: ConditionExecutor,
  [ExecutionNodeType.END_EVENT]: null,
  [ExecutionNodeType.LLM_CALL]: LLMCallExecutor,
  [ExecutionNodeType.SCRIPT]: ScriptExecutor,
  [ExecutionNodeType.SWITCH]: SwitchExecutor,
  [ExecutionNodeType.START_EVENT]: null,
};

@Injectable()
export class ExecutionGraphService {
  private stateStore: InMemoryExecutionContextStore

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef
  ) {}

  async runExecutionGraph(correlationId: string, graph: ReasoningThinkingDto, config: ExecutionGraphConfig): Promise<any> {
    const convertedGraph = await this.convertToExecutionGraph(graph);
    const engine = await this.initializeExecutionGraph(correlationId, convertedGraph, config);

    let loopCount = 0;
    const maxLoopIterations = this.configService.get('MAX_LOOP_ITERATIONS') | 100; // Safeguard against infinite loops in complex graphs
    // 3. Main execution loop
    // Continue as long as the process is RUNNING and there are active nodes to process
    while (engine.stateTracker.getCurrentState().status === ExecutionStatus.RUNNING && engine.stateTracker.getCurrentState().currentNodeIds.size > 0 && loopCount < maxLoopIterations) {
      loopCount++;
      console.log(`\n--- Loop Iteration ${loopCount} ---`);
      console.log(`Current active nodes for ${correlationId}: ${Array.from(engine.stateTracker.getCurrentState().currentNodeIds).join(', ')}`);

      const nodesProcessedInThisIteration = await this.executeActivatedNodes(
        engine, convertedGraph
      )

      // Break loop if no nodes were processed in this iteration, but the process is still running.
      // This can indicate a waiting state (e.g., for external events, or an unresolved join).
      if (nodesProcessedInThisIteration === 0 && engine.stateTracker.getCurrentState().currentNodeIds.size > 0) {
          console.log(`\nProcess instance ${correlationId} is in a waiting state (no nodes processed in this iteration).`);
          break; // Break the loop, process is waiting
      }
    }

    if (loopCount >= maxLoopIterations) {
        console.warn(`\nProcess instance ${correlationId} reached MAX_LOOP_ITERATIONS (${maxLoopIterations}). Possibly an infinite loop or complex waiting state.`);
        engine.stateTracker.setStatus(ExecutionStatus.FAILED, 'Max loop iterations reached.');
        await engine.stateTracker.persistState();
    }

    await this.finalizeExecutionGraph(correlationId, engine, convertedGraph)

    return engine.stateTracker;
  }

  /**
   * Transforms a ReasoningThinkingDto object into an ExecutionGraph interface.
   * It converts the arrays of nodes and edges into Maps for easier lookup by ID.
   *
   * @param dto The ReasoningThinkingDto instance to convert.
   * @returns An ExecutionGraph object.
   */
  async convertToExecutionGraph(dto: ReasoningThinkingDto): Promise<ExecutionGraph> {
    const nodesMap = new Map(dto.nodes.map(node => [node._id, node]));
    const edgesMap = new Map(dto.edges.map(edge => [edge._id, edge]));

    return {
      id: dto._id, // Use the _id from ReasoningThinkingDto as the graph id
      nodes: nodesMap,
      edges: edgesMap,
      inputs: dto.inputs,
      outputs: dto.outputs
    };
  }

  async initializeExecutionGraph(correlationId: string, graph: ExecutionGraph, config: ExecutionGraphConfig): Promise<GraphTraversalEngine> {
    const startNode = Array.from(graph.nodes.values()).find(node => node.type === ExecutionNodeType.START_EVENT);
    if (!startNode) {
        throw new Error("Process graph must contain a StartEvent node.");
    }

    const initialVariables = new Map(graph.inputs.map(input => [input.name, config.inputs[input.name]]));
    this.stateStore = new InMemoryExecutionContextStore();
    const tracker = await ExecutionContextTracker.createNewInstance(
      correlationId,
      startNode._id,
      initialVariables,
      this.stateStore
    );
    return new GraphTraversalEngine(graph, tracker);
  }

  async executeActivatedNodes(
    engine: GraphTraversalEngine,
    graph: ExecutionGraph,
  ): Promise<Number> {
    // Get a snapshot of currently active nodes before advancing
    // This is important because advancing one node might activate others,
    // and we want to process all currently active nodes in this iteration.
    const currentActiveNodes = new Set(engine.stateTracker.getCurrentState().currentNodeIds);

    let nodesProcessedInThisIteration = 0;
    for (const nodeId of currentActiveNodes) {
      // Check if this node is still active in the tracker's state.
      // It might have been completed by another branch in this same iteration (e.g., join gateway).
      if (!engine.stateTracker.getCurrentState().currentNodeIds.has(nodeId)) {
          continue; // Node was already processed or removed
      }

      const node = graph.nodes.get(nodeId);
      if (!node) {
          console.error(`Error: Active node ${nodeId} not found in graph.`);
          engine.stateTracker.setStatus(ExecutionStatus.FAILED, `Active node ${nodeId} not found in graph.`);
          await engine.stateTracker.persistState();

          return nodesProcessedInThisIteration;
      }

      console.log(`Processing node: ${node.label} (${node.type})`);
      switch (node.type) {
        case ExecutionNodeType.CONDITION:
        case ExecutionNodeType.END_EVENT:
        case ExecutionNodeType.LLM_CALL:
        case ExecutionNodeType.SCRIPT:
        case ExecutionNodeType.START_EVENT:
        case ExecutionNodeType.SWITCH:
          console.log(`Completion of ${node.type}: ${node.label}`);
          await this.taskNodeHandler(node, engine);
          nodesProcessedInThisIteration++
          break;
        default:
          console.warn(`Unsupported node type encountered: ${node.type}`);
          break;
      }
    }

    return nodesProcessedInThisIteration
  }

  async finalizeExecutionGraph(correlationId: string, engine: GraphTraversalEngine, graph: ExecutionGraph): Promise<void> {
    console.log(`\n--- Process instance ${correlationId} execution finished. Final Status: ${engine.stateTracker.getCurrentState().status} ---`);
    engine.stateTracker.filterVariables(graph.outputs.map(variable => variable.name))
  }

  async taskNodeHandler(node: ExecutionNodeDto, engine: GraphTraversalEngine): Promise<void> {
    console.log(`Executing task node: ${node.label}`);

    if (ExcutorMap[node.type]) {
      const executor = await this.moduleRef.resolve(ExcutorMap[node.type]);
      await executor.execute(node, engine.stateTracker)
    } else {
      console.warn(`The type ${node.type} of an executor is not defined in ExcutorMap.`)
    }

    const nextNodes = await engine.advanceExecute(node._id);
    if (nextNodes.length > 0) {
      console.log(`Activated new nodes: ${nextNodes.join(', ')}`);
    }
  }
}
