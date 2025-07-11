import { DocumentStatus } from '@caidense/reasoning/common/common.interface';


interface ExecutionGraphConfig {
  inputs: object,
  [key: string]: any;
}

export interface CreateExecution {
  thinkingId: string;
  config?: ExecutionGraphConfig;
};

interface Position {
  /**
   * The x-coordinate of the node's position in a visual layout.
   * Typically represents horizontal placement.
   */
  x: number;

  /**
   * The y-coordinate of the node's position in a visual layout.
   * Typically represents vertical placement.
   */
  y: number;
};

export interface SwitchCase {
  key: string;
  value: string;
}

interface Variable {
  id: string;

  /**
   * The name of the variable within the scope (inputs or outputs).
   */
  name: string;

  /**
   * The expected data type of the variable (e.g., 'string', 'number', 'object', 'boolean', 'array', 'any').
   */
  type: string;

  /**
   * Optional description of the variable's purpose or content.
   */
  description?: string;

  /**
   * Optional: Indicates if this variable is required.
   */
  required?: boolean;

  /**
   * Optional: Default value for the variable if not provided.
   */
  defaultValue?: any;

  /**
   * Optional: Reference link to system variable
   */
  systemRef?: string

  /**
   * Optional: For enum type, comma-separated string
   */
  enumOptions?: string[];
}

export interface ExecutionEdge {
  /**
   * A unique identifier for the edge within the execution flow.
   */
  id: string;

  /**
   * The ID of the source node from which this edge originates.
   */
  source: string;

  /**
   * Optional: The specific handle/port ID on the source node where the edge starts.
   * Useful when a node has multiple output connection points (handles).
   * If omitted, typically connects to a default or the only output handle.
   *
   * Example: If a 'Conditional' node has output handles 'true' and 'false',
   * an edge representing the 'true' path would have sourceHandle: 'true'.
   */
  sourceHandle?: string;

  /**
   * The ID of the target node where this edge ends.
   */
  target: string;

  /**
   * Optional: The specific handle/port ID on the target node where the edge ends.
   * Useful when a node has multiple input connection points (handles).
   * If omitted, typically connects to a default or the only input handle.
   *
   * Example: If an 'Action' node has an input handle 'in',
   * an edge connecting to it would have targetHandle: 'in'.
   */
  targetHandle?: string;

  /**
   * Optional: The type of the edge (e.g., 'default', 'conditional-true', 'conditional-false', 'error').
   * Can influence visualization or execution logic.
   */
  type?: string;

   /**
   * Optional: A label for the edge (e.g., condition expression for conditional edges).
   */
  label?: string;

  // Add other edge-specific properties if needed (e.g., style, animated)
  // style?: object;
  // animated?: boolean;
}

export interface ExecutionNodeConfig {
  isInference?: boolean;
  promptTemplate?: string;
  script?: string;
  switchCases: {[key: string]: any};
  [key: string]: any; // Placeholder - will be replaced by a specific union or interface later
}

interface ExecutionNode {
  /**
   * A unique identifier for the node within the execution flow.
   */
  id: string;

  /**
   * The type of the node, determining its function and behavior in the flow.
   * This could be a system-defined type (e.g., 'start', 'end', 'systemLogic', 'llmCall')
   * or a custom type representing specific logic (e.g., 'promptNode', 'decisionNode').
   * @example 'llmCall'
   */
  type: ExecutionNodeType;

  /**
   * An optional label or name displayed on the node in a visual representation.
   * @example 'Call System_Text_Analyzer'
   */
  label?: string;

  /**
   * An optional position object defining the node's coordinates in a visual layout.
   */
  position?: Position;

  /**
   * Optional configuration object specific to this node's type.
   * Contains parameters needed for the node's execution logic.
   * @example { templateId: 'abc123', analysisType: 'criteria_evaluation' }
   */
  config?: ExecutionNodeConfig;

  /**
   * Incoming array of IDs representing the incoming sequence edges to this node.
   * These edges determine how the execution reaches this node.
   * @example ['edge1', 'edge2']
   */
  incoming?: string[];

  /**
   * Optional array defining the inputs specific to this node's logic.
   * These define what data the node expects from the execution context.
   */
  inputs?: Variable[];

  /**
   * Optional array of IDs representing the outgoing sequence edges from this node.
   * These edges determine the next steps in the execution process.
   * @example ['edge1', 'edge2']
   */
  outgoing?: string[];

  /**
   * Optional array defining the outputs specific to this node's logic.
   * These define what data the node might produce and make available in the execution context.
   */
  outputs?: Variable[];

  /**
   * The timestamp when the node was created.
   */
  createdAt?: Date;

  /**
   * The timestamp when the node was last updated.
   */
  updatedAt?: Date;
}

export interface CreateThinking {
  id?: string;
  name?: string;
  description?: string;
  nodes?: ExecutionNode[];
  edges?: ExecutionEdge[];
  inputs?: Variable[];
  outputs?: Variable[];
  status?: DocumentStatus;
}

interface Thinking {
  id?: string;
  name: string;
  description: string;
  nodes: ExecutionNode[];
  edges: ExecutionEdge[];
  inputs: Variable[];
  outputs: Variable[];
  reasoningTemplateId: string;
  status?: DocumentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateThinking {
  id?: string;
  name?: string;
  description?: string;
  nodes?: ExecutionNode[];
  edges?: ExecutionEdge[];
  inputs?: Variable[];
  outputs?: Variable[];
  status?: DocumentStatus;
}

export interface CreateWorkflow {
  name: string;
  description?: string;
  tags?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  tags: string[];
  activatedReasoningThinkingId: Thinking;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VueFlowNodeData {
  label: string;
  config: ExecutionNodeConfig;
};