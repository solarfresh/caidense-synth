import { Variable } from '@caidense/reasoning/common/common.interface';


export interface ExecutionNodeConfig {
  // Depending on the 'type' property of IFlowNode,
  // this object will have different properties.
  // Example: { type: 'llm-call', model: string, promptTemplateId: string, ... }
  // Example: { type: 'tool-call', toolName: string, toolInputMapping: object, ... }
  [key: string]: any; // Placeholder - will be replaced by a specific union or interface later
}

/**
 * Defines the structure of a node within a reasoning thinking flow.
 * This interface represents a node's data within a potential flow execution context.
 * execution context.
 */
export interface ExecutionNode {
  /**
   * The type of the node, determining its function and behavior in the flow.
   * This could be a system-defined type (e.g., 'start', 'end', 'systemLogic', 'aiCall')
   * or a custom type representing specific logic (e.g., 'promptNode', 'decisionNode').
   * @example 'aiCall'
   */
  type: string;

  /**
   * An optional label or name displayed on the node in a visual representation.
   * @example 'Call System_Text_Analyzer'
   */
  label?: string;

  /**
   * Optional configuration object specific to this node's type.
   * Contains parameters needed for the node's execution logic.
   * @example { templateId: 'abc123', analysisType: 'criteria_evaluation' }
   */
  config?: ExecutionNodeConfig;

  /**
   * Optional array defining the inputs specific to this node's logic.
   * These define what data the node expects from the execution context.
   */
  inputs?: Variable[];

  /**
   * Optional script code to be executed by this node type.
   */
  script?: string

  /**
   * Optional array defining the outputs specific to this node's logic.
   * These define what data the node might produce and make available in the execution context.
   */
  outputs?: Variable[];

  /**
   * The timestamp when the node was created.
   */
  createdAt: Date;

  /**
   * The timestamp when the node was last updated.
   */
  updatedAt: Date;
}

/**
 * Defines an edge or connection between two nodes in a reasoning flow.
 */
export interface ExecutionEdge {
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
