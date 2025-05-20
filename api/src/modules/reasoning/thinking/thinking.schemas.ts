import { DocumentStatus } from '@/modules/base/base.interface';
import { VariableSchema } from '@/modules/base/base.schemas';
import { Variable } from '@caidense/reasoning/common/common.interface';
import { ExecutionEdge, ExecutionNode } from '@caidense/reasoning/graph/graph.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { ReasoningNodeConfig } from '../node/node.interface';
import { ReasoningThinking } from './thinking.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ThinkingNodeClass implements ExecutionNode {
  /**
   * The type of the node, determining its function and behavior.
   * Maps to ThinkingNode.type.
   */
  @Prop({ type: String, required: true })
  type: string;

  /**
   * An optional label displayed on the node.
   * Maps to ThinkingNode.label.
   */
  @Prop({ type: String })
  label?: string;

  /**
   * Optional configuration object specific to the node type.
   * Stored as a Mixed type to allow flexible structures.
   * Maps to ThinkingNode.config.
   */
  @Prop({ type: MongooseSchema.Types.Mixed })
  config?: ReasoningNodeConfig;

  /**
   * Optional script code to be executed by this node type.
   * Maps to script.
   */
  @Prop({ type: String })
  script?: string;

  /**
   * Optional array defining the inputs specific to this node's logic.
   * Stored as an array of embedded Variable documents.
   * Maps to inputs.
   */
  @Prop({ type: [VariableSchema] })
  inputs?: Variable[];

  /**
   * Optional array defining the outputs specific to this node's logic.
   * Stored as an array of embedded Variable documents.
   * Maps to outputs.
   */
  @Prop({ type: [VariableSchema] })
  outputs?: Variable[];

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ThinkingNodeSchema = SchemaFactory.createForClass(ThinkingNodeClass);

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ThinkingEdgeSchemaClass implements ExecutionEdge {
  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: String })
  sourceHandle?: string;

  @Prop({ type: String, required: true })
  target: string;

  @Prop({ type: String })
  targetHandle?: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String })
  label?: string;
}

export const ThinkingEdgeSchema = SchemaFactory.createForClass(ThinkingEdgeSchemaClass);

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ReasoningThinkingDocument extends Document implements ReasoningThinking {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [ThinkingNodeSchema] })
  nodes: ExecutionNode[];

  @Prop({ type: [ThinkingEdgeSchema] })
  edges: ExecutionEdge[];

  @Prop({ type: [VariableSchema] })
  inputs: Variable[];

  @Prop({ type: [VariableSchema] })
  outputs: Variable[];

  @Prop({ type: Types.ObjectId, required: true})
  reasoningTemplateId: Types.ObjectId;

  @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ReasoningThinkingSchema = SchemaFactory.createForClass(ReasoningThinkingDocument);
