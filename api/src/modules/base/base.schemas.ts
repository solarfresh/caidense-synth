import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Variable } from './base.interface';
import { Schema as MongooseSchema } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class VariableSchemaClass implements Variable {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Boolean })
  required?: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  defaultValue?: any;
}

export const VariableSchema = SchemaFactory.createForClass(VariableSchemaClass);
