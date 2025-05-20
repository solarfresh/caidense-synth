import { ExecutionEdge } from '@caidense/reasoning/graph/graph.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ExecutionEdgeSchemaClass implements ExecutionEdge {
  @Prop({ type: Types.ObjectId, required: true })
  source: string;

  @Prop({ type: String })
  sourceHandle?: string;

  @Prop({ type: Types.ObjectId, required: true })
  target: string;

  @Prop({ type: String })
  targetHandle?: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String })
  label?: string;
}

export const ExecutionEdgeSchema = SchemaFactory.createForClass(ExecutionEdgeSchemaClass);
