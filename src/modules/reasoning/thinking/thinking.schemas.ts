import { DocumentStatus, Variable } from '@/modules/base/base.interface';
import { VariableSchema } from '@/modules/base/base.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReasoningNode } from '../node/node.interface';
import { ReasoningNodeSchema } from '../node/node.schemas';
import { ReasoningThinking, ThinkingEdge } from './thinking.interface';


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

  @Prop({ type: [ReasoningNodeSchema] })
  nodes: ReasoningNode[];

  @Prop({ type: [Object] })
  edges: ThinkingEdge[];

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
