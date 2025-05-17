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

  // createdAt 和 updatedAt 會由 timestamps: true 自動處理，無需在這裡使用 @Prop 定義
}

// 創建 Mongoose Schema 實例
export const VariableSchema = SchemaFactory.createForClass(VariableSchemaClass);
