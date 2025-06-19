import { ExecutionEdge } from '@caidense/reasoning/edge/edge.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


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
export class ExecutionEdgeSchemaClass implements ExecutionEdge {
  @Prop({ type: String, required: true })
  source: string;

  @Prop({ type: String })
  sourceHandle?: string;

  @Prop({ type: String, required: true })
  target: string;

  @Prop({ type: String })
  targetHandle?: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String })
  label?: string;
}

export const ExecutionEdgeSchema = SchemaFactory.createForClass(ExecutionEdgeSchemaClass);
