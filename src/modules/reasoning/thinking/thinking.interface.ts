import { Document, Types } from 'mongoose';
import { DocumentStatus } from '@/modules/base/base.interface';


interface ThinkingStepConfig {
  // Depending on the 'type' property of IFlowNode,
  // this object will have different properties.
  // Example: { type: 'llm-call', model: string, promptTemplateId: string, ... }
  // Example: { type: 'tool-call', toolName: string, toolInputMapping: object, ... }
  [key: string]: any; // Placeholder - will be replaced by a specific union or interface later
}

/**
 * Defines the structure of a variable used in flow inputs or outputs.
 */
export interface ThinkingVariable {
  /**
   * The unique name of the variable within the scope (inputs or outputs).
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

  // Add validation rules, example values, etc., if needed
  // validation?: object;
  // example?: any;
}

/**
 * Defines a node or step within a reasoning flow.
 */
export interface ThinkingNode {
  /**
   * A unique identifier for this node within the specific flow definition.
   */
  id: string;

  /**
   * The type of operation or step this node represents (e.g., 'start', 'end', 'llm-call', 'tool-call', 'conditional', 'process', 'sub-flow').
   */
  type: string;

  /**
   * A human-readable label for this node.
   */
  label?: string;

  /**
   * Specific configuration for this node type.
   * The structure depends on the 'type' property (e.g., LLM model, prompt ID, tool name).
   */
  config: ThinkingStepConfig; // Using the placeholder interface

  /**
   * Optional: Positioning information for visualizing the node in a UI.
   */
  // position?: { x: number; y: number };

  // Add other node-specific properties if needed (e.g., style, data properties for UI)
  // style?: object;
  // data?: object; // Generic data container
}

/**
 * Defines an edge or connection between two nodes in a reasoning flow.
 */
export interface ThinkingEdge {
  /**
   * A unique identifier for this edge within the specific flow definition.
   * Can be generated (e.g., 'edge-sourceId-targetId').
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

export interface ReasoningThinking extends Document {
  /**
   *
   */
  name: string;

  /**
   * A description specific to this version's flow definition content.
   */
  description?: string;

  /**
   * An array of nodes (steps) within this flow definition.
   */
  nodes: ThinkingNode[];

  /**
   * An array of edges connecting the nodes, defining the flow path.
   */
  edges: ThinkingEdge[];

  /**
   * Definition of the expected input variables for this flow version.
   */
  inputs: ThinkingVariable[];

  /**
   * Definition of the expected output variables produced by this flow version.
   */
  outputs: ThinkingVariable[];

  /**
   * The ID of the parent Reasoning Template this definition belongs to.
   * Used for linking and potentially querying flow definitions by template.
   */
  reasoningTemplateId: Types.ObjectId;

  /**
   *
   */
  status: DocumentStatus;

  /**
   * Timestamp when the template was first created.
   */
  createdAt: Date;

  /**
   * Timestamp when the template's metadata was last updated
   * (e.g., name or description changed, but not the definition).
   */
  updatedAt: Date;
}
