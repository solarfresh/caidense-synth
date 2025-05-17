import { DocumentStatus } from '@/modules/base/base.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PromptSet, PromptSetEntry } from './set.interface';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty


@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class PromptSetDocument extends Document implements PromptSet {
  @ApiProperty({ description: 'The name of the prompt set.' })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ description: 'A brief description of the prompt set.', required: false }) // Mark as not required explicitly for clarity
  @Prop({ type: String })
  description?: string;

  @ApiProperty({ description: 'A list of tags for categorizing the prompt set.', required: false }) // Mark as not required explicitly
  @Prop({ type: [String]})
  tags?: string[];

  @ApiProperty({ description: 'An array of prompt entries included in this set.' })
  @Prop({ type: [Object] }) // Assuming PromptSetEntry maps to a BSON Object or a subdocument schema if defined elsewhere
  prompts: PromptSetEntry[];

  @ApiProperty({ description: 'The publishing status of the prompt set (draft or finalized).', enum: ['draft', 'finalized'], default: 'draft' }) // Add enum for better documentation
  @Prop({ type: String, enum: ['draft', 'finalized'], default: 'draft' })
  status: DocumentStatus;

  @ApiProperty({ description: 'The timestamp when the prompt set was created.' })
  @Prop(Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the prompt set was last updated.' })
  @Prop(Date)
  updatedAt: Date;
}

export const PromptSetSchema = SchemaFactory.createForClass(PromptSetDocument);