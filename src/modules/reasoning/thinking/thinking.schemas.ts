import { DocumentStatus } from '@/modules/base/base.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReasoningThinking, ThinkingEdge, ThinkingNode, ThinkingVariable } from './thinking.interface';


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

  @Prop({ type: [Object] })
  nodes: ThinkingNode[];

  @Prop({ type: [Object] })
  edges: ThinkingEdge[];

  @Prop({ type: [Object] })
  inputs: ThinkingVariable[];

  @Prop({ type: [Object] })
  outputs: ThinkingVariable[];

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
