import { DocumentStatus } from '@/modules/base/base.interface';
import { Variable } from '@caidense/reasoning/common/common.interface';
import { ExecutionEdge } from '@caidense/reasoning/edge/edge.interface';
import { ExecutionNode } from '@caidense/reasoning/node/node.interface';
import { Document, Types } from 'mongoose';


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
  nodes: ExecutionNode[];

  /**
   * An array of edges connecting the nodes, defining the flow path.
   */
  edges: ExecutionEdge[];

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
