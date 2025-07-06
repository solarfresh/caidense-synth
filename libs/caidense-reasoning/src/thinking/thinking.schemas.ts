import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { VariableSchema, VariableSchemaClass } from '@caidense/reasoning/common/common.schemas';
import { ExecutionEdgeSchema, ExecutionEdgeSchemaClass } from '@caidense/reasoning/edge/edge.schemas';
import { ExecutionNodeClass, ExecutionNodeSchema } from '@caidense/reasoning/node/node.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReasoningThinking } from './thinking.interface';


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

  @Prop({ type: [ExecutionNodeSchema]})
  nodes: ExecutionNodeClass[];

  @Prop({ type: [ExecutionEdgeSchema] })
  edges: ExecutionEdgeSchemaClass[];

  @Prop({ type: [VariableSchema] })
  inputs: VariableSchemaClass[];

  @Prop({ type: [VariableSchema] })
  outputs: VariableSchemaClass[];

  @Prop({ type: Types.ObjectId, required: true})
  reasoningTemplateId: Types.ObjectId;

  @Prop({ type: String, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ReasoningThinkingSchema = SchemaFactory.createForClass(ReasoningThinkingDocument);
