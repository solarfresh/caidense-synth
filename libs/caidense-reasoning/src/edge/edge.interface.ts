import { Types } from 'mongoose';


/**
 * Defines an edge or connection between two nodes in a reasoning flow.
 */
export interface ExecutionEdge {
  /**
   * The ID of the source node from which this edge originates.
   */
  source: Types.ObjectId;

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
  target: Types.ObjectId;

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
