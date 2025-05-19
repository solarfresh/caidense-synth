import { ExecutionStatus } from './execution-status.enum';
import { Variable } from './common.interface';


export interface ExcutionNodeConfig {
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
export interface ExcutionNode {
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
  config?: ExcutionNodeConfig;

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
