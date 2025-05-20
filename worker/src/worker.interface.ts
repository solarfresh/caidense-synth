import { ExecutionGraph } from '@caidense/reasoning/graph/graph.interface';
import { TaskExecutionContext } from './interfaces/task.interface';


export interface WorkerExecutionTask {
  /**
   * A unique identifier correlating this task request.
   * The worker must include this exact ID in the response payload.
   * This ID is CRITICAL for the orchestrator to match the incoming
   * asynchronous result to the original request it sent.
   */
  correlationId: string;

  /**
   * The name of the RabbitMQ queue or topic where the worker should send
   * the result payload back. This is part of the request-response mechanism
   * initiated by the orchestrator.
   */
  replyTo: string; // Or a similar identifier understood by the message broker

  /**
   * A whole graph, including the node to be executed.
   * This includes the node's type, configuration, script (if any), inputs, outputs.
   */
  graph: ExecutionGraph;

  /**
   * The current state of the flow execution context when this node
   * is ready to be executed. The worker uses this as input and
   * returns the updated version in the result payload.
   */
  executionContext: TaskExecutionContext;

  // You might add other task-specific parameters here if needed, e.g.:
  // timeoutMilliseconds?: number; // A specific timeout for this node execution task
  // priority?: number; // Optional priority for task processing in the worker queue
  // metadata?: { [key: string]: any }; // Any other metadata related to the task itself
}