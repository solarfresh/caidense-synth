import { Variable } from '@caidense/reasoning/common/common.interface';
import { VariableSchema } from '@caidense/reasoning/common/common.schemas';
import { ExecutionNodeType } from '@caidense/reasoning/execution/execution.interface';
import { ExecutionEdge, ExecutionNode, ExecutionNodeConfig } from '@caidense/reasoning/graph/graph.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ExecutionNodeClass implements ExecutionNode {
  /**
   * The type of the node, determining its function and behavior.
   */
  @Prop({ type: ExecutionNodeType, required: true })
  type: ExecutionNodeType;

  /**
   * An optional label displayed on the node.
   */
  @Prop({ type: String })
  label?: string;

  /**
   * Optional configuration object specific to the node type.
   * Stored as a Mixed type to allow flexible structures.
   * Maps to ThinkingNode.config.
   */
  @Prop({ type: MongooseSchema.Types.Mixed })
  config?: ExecutionNodeConfig;

  /**
   * Optional array of IDs representing the incoming sequence edges to this node.
  */
  @Prop({ type: Types.ObjectId })
  incoming?: string[];

  /**
   * Optional array defining the inputs specific to this node's logic.
   * Stored as an array of embedded Variable documents.
   * Maps to inputs.
   */
  @Prop({ type: [VariableSchema] })
  inputs?: Variable[];

  /**
   * Optional script code to be executed by this node type.
   * Maps to script.
   */
  @Prop({ type: String })
  script?: string;

  /**
   * Optional array of IDs representing the outgoing sequence edges from this node.
   */
  @Prop({ type: Types.ObjectId })
  outgoing?: string[];

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

export const ExecutionNodeSchema = SchemaFactory.createForClass(ExecutionNodeClass);

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ExecutionEdgeSchemaClass implements ExecutionEdge {
  @Prop({ type: Types.ObjectId, required: true })
  source: string;

  @Prop({ type: String })
  sourceHandle?: string;

  @Prop({ type: Types.ObjectId, required: true })
  target: string;

  @Prop({ type: String })
  targetHandle?: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String })
  label?: string;
}

export const ExecutionEdgeSchema = SchemaFactory.createForClass(ExecutionEdgeSchemaClass);
