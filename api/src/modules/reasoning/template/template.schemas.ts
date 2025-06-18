import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReasoningTemplate } from './template.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ReasoningTemplateDocument extends Document implements ReasoningTemplate {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ type: Types.ObjectId, ref: 'ReasoningThinkingDocument'})
  activatedReasoningThinkingId?: Types.ObjectId;

  @Prop({ type: String, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ReasoningTemplateSchema = SchemaFactory.createForClass(ReasoningTemplateDocument);
