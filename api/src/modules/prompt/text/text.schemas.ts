import { DocumentStatus, Variable } from '@caidense/reasoning/common/common.interface';
import { VariableSchema } from '@caidense/reasoning/common/common.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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

  @Prop({ type: [VariableSchema] })
  variables: Variable[];

  @Prop({ type: String, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Prop({ type: Types.ObjectId })
  promptSetId: Types.ObjectId

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const PromptTextSchema = SchemaFactory.createForClass(PromptTextDocument);
