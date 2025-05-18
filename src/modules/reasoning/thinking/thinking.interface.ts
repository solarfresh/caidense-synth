import { DocumentStatus, Variable } from '@/modules/base/base.interface';
import { Document, Types } from 'mongoose';
import { ReasoningNode } from '../node/node.interface';


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
  nodes: ReasoningNode[];

  /**
   * An array of edges connecting the nodes, defining the flow path.
   */
  edges: ThinkingEdge[];

  /**
   * Definition of the expected input variables for this flow version.
   */
  inputs: Variable[];

  /**
   * Definition of the expected output variables produced by this flow version.
   */
  outputs: Variable[];

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
