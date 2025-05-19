import { ExecutionStatus } from './execution-status.enum';
import { ExcutionNode, NodeExecutionHistoryEntry } from './node.interface';


/**
 * Represents the initial parameters provided when a flow execution is initiated.
 * These typically map to the flow's defined input variables.
 */
interface TaskExecutionParameters {
  [key: string]: any; // Key-value pairs of initial input data
}

/**
 * Represents the current state and history of a single thinking flow execution run.
 * This object is passed between executors as the flow progresses.
 */
export interface TaskExecutionContext {
  /**
   * A unique identifier for this specific execution run instance.
   * Generated when the execution starts.
   */
  executionId: string;

  /**
   * The ID of the ReasoningThinking document that defines the flow structure being executed.
   */
  flowId: string;

  /**
   * Optional: The ID of the ReasoningTemplate document that triggered this execution.
   */
  templateId?: string;

  /**
   * Timestamp when the overall flow execution started.
   */
  startTime: Date;

  /**
   * Timestamp when the overall flow execution ended (set upon completion).
   */
  endTime?: Date; // Optional: set when execution completes (success, failure, cancelled)

  /**
   * The current overall status of the flow execution.
   */
  status: ExecutionStatus;

  /**
   * The main store of variables that are accessible and modifiable
   * by nodes during the execution. These correspond to the flow's
   * defined inputs and outputs, plus any intermediate variables.
   */
  flowVariables: { [key: string]: any };

  /**
   * Optional parameters provided when the flow execution was initiated.
   */
  parameters?: TaskExecutionParameters;

  /**
   * A chronological list of nodes that have been executed in this run.
   */
  history: NodeExecutionHistoryEntry[];

  /**
   * Accumulated logs from all node executions during this run.
   */
  logs?: string[];

  /**
   * Optional: Error message for the overall flow execution if the status is 'failed'.
   */
  error?: string;

  // Add any other state needed during execution, e.g.:
  // currentPage?: string; // If the flow corresponds to a multi-page interaction
  // currentUserId?: string; // If execution is tied to a specific user
}

export interface NodeExecutionTask {
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
   * The definition of the ExcutionNode instance to be executed.
   * This includes the node's type, configuration, script (if any), inputs, outputs.
   */
  node: ExcutionNode;

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