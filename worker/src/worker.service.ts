import { Injectable, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ExecutorExecutionResult, TaskExecutionResult } from './interfaces/executor.interface'; // Interface for executor execution result
import { NodeExecutionTask } from './interfaces/task.interface'; // Interface for task payload received from Orchestrator
import { NodeExecutorRegistry } from './execution/executor.registry'; // Registry for node executors


@Injectable()
export class WorkerService {
  constructor(
    // Inject the NodeExecutorRegistry which was configured in the WorkerModule
    private readonly executorRegistry: NodeExecutorRegistry,
  ) {}

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
    @Payload() task: NodeExecutionTask, // The received task payload
    @Ctx() context: RmqContext, // The RabbitMQ context
  ): Promise<TaskExecutionResult> { // The structure expected by the orchestrator
    const originalMessage = context.getMessage(); // Access the original message for acknowledgment
    const { node, executionContext, correlationId } = task; // Destructure relevant parts from the task payload

    console.log(`█ Worker received task ${correlationId} for node type: ${node.type}`);
    // console.log('Received Context Snippet:', { ...executionContext, flowVariables: { ...executionContext.flowVariables, /* mask sensitive data */ } }); // Log received context snippet

    let result: TaskExecutionResult;
    let logs: string[] = [];

    const addLog = (message: string) => {
        logs.push(`[Worker] ${new Date().toISOString()} ${message}`);
        console.log(`[Worker] ${message}`); // Log locally
    };


    try {
      // Find the correct executor based on the node type
      const executor = this.executorRegistry.getExecutor(node.type);

      if (!executor) {
        addLog(`Error: No executor found for node type: ${node.type}`);
        result = {
          correlationId: correlationId, // Ensure correlation ID is included in the response
          error: `No executor found for type: ${node.type}`,
          logs: logs,
          updatedContext: executionContext, // Return original context on configuration error
          nextNodeIds: [], // No next node on error
          returnValue: undefined, // No return value on error
        };
      } else {
        // Execute the node logic using the found executor
        // The executor should handle its specific config and interact with external services (AI, DB, etc.)
        // The executor is responsible for returning the updated context, next node IDs, logs, and error status.
        const executorExecutionResult: ExecutorExecutionResult = await executor.execute(node, executionContext);

        // Build the result payload to send back to the orchestrator
        result = {
          correlationId: correlationId, // Link the result back to the original task
          updatedContext: executorExecutionResult.updatedContext,
          nextNodeIds: executorExecutionResult.nextNodeIds,
          logs: logs.concat(executorExecutionResult.logs || []), // Combine worker logs with executor logs
          error: executorExecutionResult.error,
          returnValue: executorExecutionResult.returnValue,
        };
      }
    } catch (error: any) {
      // Catch any unexpected errors during executor lookup or execution (if not caught inside executor)
      addLog(`Fatal Error executing node task ${correlationId} for type ${node.type}: ${error.message || error}`);
      console.error(`Fatal Error details:`, error); // Log full error details on the worker side

      result = {
        correlationId: correlationId,
        error: `Fatal Execution error for type ${node.type}: ${error.message || error}`,
        logs: logs, // Include logs captured before the fatal error
        updatedContext: executionContext, // Return original context on unhandled error
        nextNodeIds: [], // No next node on unhandled error
        returnValue: undefined,
      };
    } finally {
       // Crucial: Acknowledge the message after processing (success or failure)
       // This tells RabbitMQ that the message has been handled and prevents redelivery.
       try {
           originalMessage.ack();
           addLog(`Message ${correlationId} acknowledged.`); // Optional: Log acknowledgment
       } catch (ackError) {
           console.error(`Failed to acknowledge message ${correlationId}:`, ackError);
           // Handle acknowledgment error if necessary (less common scenario)
       }
    }

    // NestJS microservices automatically handle sending the returned 'result' object
    // back to the client (the orchestrator in request-response mode).
    return result;
  }
}