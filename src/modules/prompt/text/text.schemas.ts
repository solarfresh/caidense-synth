import { DocumentStatus, Variable } from '@/modules/base/base.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PromptText } from './text.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class PromptTextDocument extends Document implements PromptText {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [String]})
  tags?: string[];

  @Prop({ type: String })
  promptText: string;

  @Prop({ type: [Object] })
  variables: Variable[];

  @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const PromptTextSchema = SchemaFactory.createForClass(PromptTextDocument);
