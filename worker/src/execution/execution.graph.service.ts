import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';
import { LLMCallExecutor } from '@caidense/reasoning/executor/genai/genai.service';
import { ExecutionGraph, ExecutionGraphConfig } from '@caidense/reasoning/graph/graph.interface';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker, InMemoryExecutionContextStore } from '@caidense/reasoning/state/state.service';
import { ReasoningThinkingDto } from '@caidense/reasoning/thinking/dto/thinking.dto';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GraphTraversalEngine } from '../traverse/traverse.service';


const ExcutorMap: Record<ExecutionNodeType, any> = {
  [ExecutionNodeType.LLM_CALL]: LLMCallExecutor,
  [ExecutionNodeType.START_EVENT]: null,
  [ExecutionNodeType.END_EVENT]: null,
  [ExecutionNodeType.SCRIPT]: null
};

@Injectable()
export class ExecutionGraphService {
  private tracker: ExecutionContextTracker
  private stateStore: InMemoryExecutionContextStore

  constructor(
    private readonly moduleRef: ModuleRef
  ) {}
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

  async runExecutionGraph(correlationId: string, graph: ReasoningThinkingDto, config: ExecutionGraphConfig): Promise<any> {
    const convertedGraph = await this.convertToExecutionGraph(graph);
    const engine = await this.initializeExecutionGraph(correlationId, convertedGraph, config);

    let loopCount = 0;
    const MAX_LOOP_ITERATIONS = 100; // Safeguard against infinite loops in complex graphs
    // 3. Main execution loop
    // Continue as long as the process is RUNNING and there are active nodes to process
    while (this.tracker.getCurrentState().status === ExecutionStatus.RUNNING && this.tracker.getCurrentState().currentNodeIds.size > 0 && loopCount < MAX_LOOP_ITERATIONS) {
      loopCount++;
      console.log(`\n--- Loop Iteration ${loopCount} ---`);
      console.log(`Current active nodes for ${correlationId}: ${Array.from(this.tracker.getCurrentState().currentNodeIds).join(', ')}`);

      const nodesProcessedInThisIteration = await this.executeActivatedNodes(
        engine, convertedGraph
      )

      // Break loop if no nodes were processed in this iteration, but the process is still running.
      // This can indicate a waiting state (e.g., for external events, or an unresolved join).
      if (nodesProcessedInThisIteration === 0 && this.tracker.getCurrentState().currentNodeIds.size > 0) {
          console.log(`\nProcess instance ${correlationId} is in a waiting state (no nodes processed in this iteration).`);
          break; // Break the loop, process is waiting
      }
    }

    if (loopCount >= MAX_LOOP_ITERATIONS) {
        console.warn(`\nProcess instance ${correlationId} reached MAX_LOOP_ITERATIONS (${MAX_LOOP_ITERATIONS}). Possibly an infinite loop or complex waiting state.`);
        this.tracker.setStatus(ExecutionStatus.FAILED, 'Max loop iterations reached.');
        await this.tracker.persistState();
    }

    console.log(`\n--- Process instance ${correlationId} execution finished. Final Status: ${this.tracker.getCurrentState().status} ---`);
    return this.tracker;
  }

  async initializeExecutionGraph(correlationId: string, graph: ExecutionGraph, config: ExecutionGraphConfig): Promise<GraphTraversalEngine> {
    const startNode = Array.from(graph.nodes.values()).find(node => node.type === ExecutionNodeType.START_EVENT);
    if (!startNode) {
        throw new Error("Process graph must contain a StartEvent node.");
    }

    const initialVariables = new Map(graph.inputs.map(input => [input.name, config.inputs.get(input.name)]));
    console.log(`initialVariables: ${initialVariables}`)

    this.stateStore = new InMemoryExecutionContextStore();
    this.tracker = await ExecutionContextTracker.createNewInstance(
      correlationId,
      startNode._id,
      initialVariables,
      this.stateStore
    );
    return new GraphTraversalEngine(graph, this.tracker);
  }

  async executeActivatedNodes(
    engine: GraphTraversalEngine,
    graph: ExecutionGraph,
  ): Promise<Number> {
    // Get a snapshot of currently active nodes before advancing
    // This is important because advancing one node might activate others,
    // and we want to process all currently active nodes in this iteration.
    const currentActiveNodes = new Set(this.tracker.getCurrentState().currentNodeIds);

    let nodesProcessedInThisIteration = 0;
    for (const nodeId of currentActiveNodes) {
        // Check if this node is still active in the tracker's state.
        // It might have been completed by another branch in this same iteration (e.g., join gateway).
        if (!this.tracker.getCurrentState().currentNodeIds.has(nodeId)) {
            continue; // Node was already processed or removed
        }

        const node = graph.nodes.get(nodeId);
        if (!node) {
            console.error(`Error: Active node ${nodeId} not found in graph.`);
            this.tracker.setStatus(ExecutionStatus.FAILED, `Active node ${nodeId} not found in graph.`);
            await this.tracker.persistState();

            return nodesProcessedInThisIteration;
        }

        console.log(`Processing node: ${node.label} (${node.type})`);

        // Simulate the completion of the current active node.
        // For tasks, this is where actual work would be done, and then its completion reported.
        // For gateways and events, they are often "completed" internally by the traversal engine
        // as soon as their conditions/triggers are met.
        if (node.type === ExecutionNodeType.LLM_CALL || node.type === ExecutionNodeType.START_EVENT || node.type === ExecutionNodeType.END_EVENT) {
            console.log(`Simulating completion of ${node.type}: ${node.label}`);
            await this.taskNodeHandler(node, engine);

            nodesProcessedInThisIteration++;
        // } else if (node.type === ExecutionNodeType.EXCLUSIVE_GATEWAY || node.type === ExecutionNodeType.PARALLEL_GATEWAY || node.type === ExecutionNodeType.INCLUSIVE_GATEWAY || node.type === ExecutionNodeType.EVENT_BASED_GATEWAY) {
        //     // Gateways and Event-Based Gateways are typically "completed" by the traversal logic itself
        //     // as soon as their routing conditions are met or an event is caught.
        //     // We don't need a separate 'completion' call here like for tasks.
        //     // The `advanceProcess` method (which internally handles gateway logic) implicitly moves past them.
        //     // For Event-Based Gateways, this loop needs an external event source.
        //     // For simplicity, we assume if it's active, its conditions might be met immediately in this loop.
        //     // If a gateway is active and not resolved, it will stay in activeNodeIds.
        //     console.log(`Attempting to resolve gateway/event: ${node.label} (${node.type})`);
        //     // Call advanceProcess with the gateway node itself to re-evaluate its outputs.
        //     // This is crucial for joins, as they might have received an incoming flow from a parallel branch.
        //     const nextNodes = await engine.advanceExecute(node._id); // Gateway becomes 'completed' internally by the engine
        //     if (nextNodes.length > 0) {
        //         console.log(`Gateway ${node._id} activated new nodes: ${nextNodes.join(', ')}`);
        //     }
        //     nodesProcessedInThisIteration++;

        //     // If a gateway is still active after being "advanced" (e.g., a join waiting for more flows),
        //     // it means it could not resolve in this iteration and will remain in activeNodeIds for next loop.
        }
    }

    return nodesProcessedInThisIteration
  }

  async taskNodeHandler(node: ExecutionNodeDto, engine: GraphTraversalEngine): Promise<void> {
    console.log(`Executing task node: ${node.label}`);

    if (ExcutorMap[node.type]) {
      const executor = await this.moduleRef.resolve(ExcutorMap[node.type]);
      await executor.execute(node, this.tracker)
    } else {
      console.warn(`The type ${node.type} of an executor is not defined in ExcutorMap.`)
    }

    const nextNodes = await engine.advanceExecute(node._id);
    if (nextNodes.length > 0) {
        console.log(`Activated new nodes: ${nextNodes.join(', ')}`);
    }
  }
}
