import { Variable } from '@caidense/reasoning/common/common.interface';
import { VariableSchema } from '@caidense/reasoning/common/common.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ReasoningNode, ReasoningNodeConfig } from './node.interface';


/**
 * Represents a node within a reasoning thinking flow as stored in the database.
 * Corresponds to the ReasoningNode interface.
 */
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ReasoningNodeDocument extends Document implements ReasoningNode {

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  /**
   * The type of the node, determining its function and behavior.
   * Maps to ReasoningNode.type.
   */
  @Prop({ type: String, required: true })
  type: string;

  /**
   * An optional label displayed on the node.
   * Maps to ReasoningNode.label.
   */
  @Prop({ type: String })
  label?: string;

  /**
   * Optional configuration object specific to the node type.
   * Stored as a Mixed type to allow flexible structures.
   * Maps to ReasoningNode.config.
   */
  @Prop({ type: MongooseSchema.Types.Mixed })
  config?: ReasoningNodeConfig;

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

export const ReasoningNodeSchema = SchemaFactory.createForClass(ReasoningNodeDocument);
