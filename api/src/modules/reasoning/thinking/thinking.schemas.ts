import { DocumentStatus } from '@/modules/base/base.interface';
import { Variable } from '@caidense/reasoning/common/common.interface';
import { VariableSchema } from '@caidense/reasoning/common/common.schemas';
import { ExecutionEdge } from '@caidense/reasoning/graph/graph.interface';
import { ExecutionEdgeSchema } from '@caidense/reasoning/graph/graph.schemas';
import { ExecutionNodeSchema } from '@caidense/reasoning/node/node.schemas';
import { ExecutionNode } from '@caidense/reasoning/node/node.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReasoningThinking } from './thinking.interface';


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class ReasoningThinkingDocument extends Document implements ReasoningThinking {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [ExecutionNodeSchema] })
  nodes: ExecutionNode[];

  @Prop({ type: [ExecutionEdgeSchema] })
  edges: ExecutionEdge[];

  @Prop({ type: [VariableSchema] })
  inputs: Variable[];

  @Prop({ type: [VariableSchema] })
  outputs: Variable[];

  @Prop({ type: Types.ObjectId, required: true})
  reasoningTemplateId: Types.ObjectId;

  @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
  status: DocumentStatus;

  @Prop(Date)
  createdAt: Date;

  @Prop(Date)
  updatedAt: Date;
}

export const ReasoningThinkingSchema = SchemaFactory.createForClass(ReasoningThinkingDocument);
