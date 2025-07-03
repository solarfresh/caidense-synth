import { Variable } from '@caidense/reasoning/common/common.interface';
import { VariableSchema, VariableSchemaClass } from '@caidense/reasoning/common/common.schemas';
import { ExecutionNode, ExecutionNodeConfig, ExecutionNodeType, Position } from '@caidense/reasoning/node/node.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc: any, ret: any) {
      delete ret.__v;
      delete ret._id;
    }
  },
})
export class ExecutionNodeClass implements ExecutionNode {
  /**
   * The type of the node, determining its function and behavior.
   */
  @Prop({ type: String, required: true })
  type: ExecutionNodeType;

  /**
   * An optional label displayed on the node.
   */
  @Prop({ type: String })
  label?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  position?: Position;

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
  @Prop({ type: [Types.ObjectId] })
  incoming?: string[];

  /**
   * Optional array defining the inputs specific to this node's logic.
   * Stored as an array of embedded Variable documents.
   * Maps to inputs.
   */
  @Prop({ type: [VariableSchema] })
  inputs?: VariableSchemaClass[];

  /**
   * Optional array of IDs representing the outgoing sequence edges from this node.
   */
  @Prop({ type: [Types.ObjectId] })
  outgoing?: string[];

  /**
   * Optional array defining the outputs specific to this node's logic.
   * Stored as an array of embedded Variable documents.
   * Maps to outputs.
   */
  @Prop({ type: [VariableSchema] })
  outputs?: VariableSchemaClass[];

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ExecutionNodeSchema = SchemaFactory.createForClass(ExecutionNodeClass);
