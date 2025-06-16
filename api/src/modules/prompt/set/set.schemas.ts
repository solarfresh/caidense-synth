import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PromptSet } from './set.interface';


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

  @Prop({ type: [Types.ObjectId] }) // Assuming PromptSetEntry maps to a BSON Object or a subdocument schema if defined elsewhere
  promptTextIds: Types.ObjectId[];

  @Prop({ type: String, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const PromptSetSchema = SchemaFactory.createForClass(PromptSetDocument);