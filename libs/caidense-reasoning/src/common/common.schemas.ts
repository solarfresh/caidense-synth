import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { Variable } from '@caidense/reasoning/common/common.interface';
import { Schema as MongooseSchema } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc: any, ret: any) {
      delete ret.__v;
      delete ret._id;
    }
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

  @Prop({ type: String })
  systemRef?: string

  @Prop({ type: [String] })
  enumOptions?: string[];
}

export const VariableSchema = SchemaFactory.createForClass(VariableSchemaClass);
