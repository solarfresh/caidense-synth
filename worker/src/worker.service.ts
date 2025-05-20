import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';
import { Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NodeExecutorRegistry } from './execution/executor.registry'; // Registry for node executors
import { ExecutorExecutionResult, TaskExecutionResult } from './interfaces/executor.interface'; // Interface for executor execution result
import { ExecutionInstanceStateTracker, InMemoryExecutionInstanceStateStore } from './state/state.service'; // Tracker for execution instance state
import { GraphTraversalEngine } from './traverse/traverse.service';
import { WorkerExecutionTask } from './worker.interface'; // Interface for worker execution task
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';


@Injectable()
export class WorkerService {

  constructor(
    // Inject the NodeExecutorRegistry which was configured in the WorkerModule
    private readonly executorRegistry: NodeExecutorRegistry,
    private readonly stateStore: InMemoryExecutionInstanceStateStore, // Inject the state store for execution instance state management
  ) {}

  async runExecutionGraph(task: WorkerExecutionTask): Promise<ExecutionInstanceStateTracker> {
    const { graph, executionContext, correlationId } = task;

    const startNode = Array.from(graph.nodes.values()).find(node => node.type === ExecutionNodeType.START_EVENT);
    if (!startNode) {
        throw new Error("Process graph must contain a StartEvent node.");
    }

    const tracker = await ExecutionInstanceStateTracker.createNewInstance(
      correlationId,
      'initialNodeId',
      new Map([["orderAmount", 1200]]),
      this.stateStore
    );
    const engine = new GraphTraversalEngine(graph, tracker);

    let loopCount = 0;
    const MAX_LOOP_ITERATIONS = 100; // Safeguard against infinite loops in complex graphs
    // 3. Main execution loop
    // Continue as long as the process is RUNNING and there are active nodes to process
    while (tracker.getCurrentState().status === ExecutionStatus.RUNNING && tracker.getCurrentState().currentNodeIds.size > 0 && loopCount < MAX_LOOP_ITERATIONS) {
      loopCount++;
      console.log(`\n--- Loop Iteration ${loopCount} ---`);
      console.log(`Current active nodes for ${correlationId}: ${Array.from(tracker.getCurrentState().currentNodeIds).join(', ')}`);

      // Get a snapshot of currently active nodes before advancing
      // This is important because advancing one node might activate others,
      // and we want to process all currently active nodes in this iteration.
      const currentActiveNodes = new Set(tracker.getCurrentState().currentNodeIds);

      let nodesProcessedInThisIteration = 0;
      for (const nodeId of currentActiveNodes) {
          // Check if this node is still active in the tracker's state.
          // It might have been completed by another branch in this same iteration (e.g., join gateway).
          if (!tracker.getCurrentState().currentNodeIds.has(nodeId)) {
              continue; // Node was already processed or removed
          }

          const node = graph.nodes.get(nodeId);
          if (!node) {
              console.error(`Error: Active node ${nodeId} not found in graph.`);
              tracker.setStatus(ExecutionStatus.FAILED, `Active node ${nodeId} not found in graph.`);
              await tracker.persistState();

              return tracker;
          }

          console.log(`Processing node: ${node.label} (${node.type})`);

          // Simulate the completion of the current active node.
          // For tasks, this is where actual work would be done, and then its completion reported.
          // For gateways and events, they are often "completed" internally by the traversal engine
          // as soon as their conditions/triggers are met.
          if (node.type === ExecutionNodeType.TASK || node.type === ExecutionNodeType.START_EVENT || node.type === ExecutionNodeType.END_EVENT) {
              // In a real system:
              // For a 'Task', this might involve calling an external service,
              // or waiting for user input, then calling `advanceProcess` once done.
              // Here, we simulate immediate completion for automation.
              console.log(`Simulating completion of ${node.type}: ${node.label}`);
              const nextNodes = await engine.advanceExecute(node._id);
              if (nextNodes.length > 0) {
                  console.log(`Activated new nodes: ${nextNodes.join(', ')}`);
              }
              nodesProcessedInThisIteration++;
          } else if (node.type === ExecutionNodeType.EXCLUSIVE_GATEWAY || node.type === ExecutionNodeType.PARALLEL_GATEWAY || node.type === ExecutionNodeType.INCLUSIVE_GATEWAY || node.type === ExecutionNodeType.EVENT_BASED_GATEWAY) {
              // Gateways and Event-Based Gateways are typically "completed" by the traversal logic itself
              // as soon as their routing conditions are met or an event is caught.
              // We don't need a separate 'completion' call here like for tasks.
              // The `advanceProcess` method (which internally handles gateway logic) implicitly moves past them.
              // For Event-Based Gateways, this loop needs an external event source.
              // For simplicity, we assume if it's active, its conditions might be met immediately in this loop.
              // If a gateway is active and not resolved, it will stay in activeNodeIds.
              console.log(`Attempting to resolve gateway/event: ${node.label} (${node.type})`);
              // Call advanceProcess with the gateway node itself to re-evaluate its outputs.
              // This is crucial for joins, as they might have received an incoming flow from a parallel branch.
              const nextNodes = await engine.advanceExecute(node._id); // Gateway becomes 'completed' internally by the engine
              if (nextNodes.length > 0) {
                  console.log(`Gateway ${node._id} activated new nodes: ${nextNodes.join(', ')}`);
              }
              nodesProcessedInThisIteration++;

              // If a gateway is still active after being "advanced" (e.g., a join waiting for more flows),
              // it means it could not resolve in this iteration and will remain in activeNodeIds for next loop.
          }
      }

      // Break loop if no nodes were processed in this iteration, but the process is still running.
      // This can indicate a waiting state (e.g., for external events, or an unresolved join).
      if (nodesProcessedInThisIteration === 0 && tracker.getCurrentState().currentNodeIds.size > 0) {
          console.log(`\nProcess instance ${correlationId} is in a waiting state (no nodes processed in this iteration).`);
          break; // Break the loop, process is waiting
      }
    }

    if (loopCount >= MAX_LOOP_ITERATIONS) {
        console.warn(`\nProcess instance ${correlationId} reached MAX_LOOP_ITERATIONS (${MAX_LOOP_ITERATIONS}). Possibly an infinite loop or complex waiting state.`);
        tracker.setStatus(ExecutionStatus.FAILED, 'Max loop iterations reached.');
        await tracker.persistState();
    }

    console.log(`\n--- Process instance ${correlationId} execution finished. Final Status: ${tracker.getCurrentState().status} ---`);
    return tracker;
  }

  /**
   * Message handler for incoming node execution tasks from the orchestrator.
   * Listens to the command defined for task execution (e.g., 'execute_node_task').
   *
   * @param task The payload containing the node definition, execution context, etc.
   * @param context The RabbitMQ context providing access to the original message and reply channel.
   * @returns A Promise resolving to the execution result payload to send back to the orchestrator.
   */
  @MessagePattern('execute_node_task') // Assumes the orchestrator sends messages with the command 'execute_node_task'
  async executeNodeTask(
    @Payload() task: WorkerExecutionTask, // The received task payload
    @Ctx() context: RmqContext, // The RabbitMQ context
  ): Promise<TaskExecutionResult> { // The structure expected by the orchestrator
    const originalMessage = context.getMessage(); // Access the original message for acknowledgment
    const { graph, executionContext, correlationId } = task; // Destructure relevant parts from the task payload

    console.log(`█ Worker received task ${correlationId} for graph: ${graph.id}`);

    // console.log('Received Context Snippet:', { ...executionContext, flowVariables: { ...executionContext.flowVariables, /* mask sensitive data */ } }); // Log received context snippet
    try {
        // Execute the task using the execution graph
        await this.runExecutionGraph(task);
        console.log(`█ Worker completed task ${correlationId} successfully.`);
    } catch (error) {
        console.error(`█ Worker failed to execute task ${correlationId}:`, error);
    } finally {
        // Acknowledge the original message to RabbitMQ
        const channel = context.getChannelRef();
        channel.ack(originalMessage);
        return {
          correlationId,
        };
    }
  }
}