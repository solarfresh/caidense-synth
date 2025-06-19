import { Variable } from '@caidense/reasoning/common/common.interface';


export enum ExecutionNodeType {
  LLM_CALL = 'llmCall',
  START_EVENT = 'startEvent',
  END_EVENT = 'endEvent',
  SCRIPT = 'script',
}

export interface Position {
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
   * Optional script code to be executed by this node type.
   */
  script?: string

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
  createdAt: Date;

  /**
   * The timestamp when the node was last updated.
   */
  updatedAt: Date;
}
