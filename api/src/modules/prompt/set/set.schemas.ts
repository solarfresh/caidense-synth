import { DocumentStatus } from '@/modules/base/base.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PromptSet, PromptSetEntry } from './set.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class PromptSetDocument extends Document implements PromptSet {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [String]})
  tags?: string[];

  @Prop({ type: [Object] }) // Assuming PromptSetEntry maps to a BSON Object or a subdocument schema if defined elsewhere
  prompts: PromptSetEntry[];

  @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const PromptSetSchema = SchemaFactory.createForClass(PromptSetDocument);