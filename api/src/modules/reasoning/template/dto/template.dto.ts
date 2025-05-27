import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReasoningTemplateDocument } from '../template.schemas';

/**
 * Defines the data structure for representing a single Reasoning Template document in API responses.
 * This DTO contains the template's content and its metadata.
 */
export class ReasoningTemplateDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the reasoning template document.',
    example: '60c8d6c1f5a4c8a7f0b1c2d3',
  })
  _id: string;

  @ApiProperty({ description: 'The name of the reasoning template.' })
  name: string;

  @ApiProperty({
    description: 'A brief description of the reasoning template (Optional).',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The ID of the thinking flow document associated with this template (Optional).',
    required: false,
    example: '60c8d6c1f5a4c8a7f0b1c2d4',
  })
  activatedReasoningThinkingId?: string;

  @ApiProperty({
    description: 'The publishing status of the reasoning template document.',
    enum: DocumentStatus,
    example: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @ApiProperty({ description: 'The timestamp when the reasoning template document was created.' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the reasoning template document was last updated.' })
  @Type(() => Date)
  updatedAt: Date;

  // Note: The actual template content (like the prompt text components) would
  // likely be in separate fields or managed via related entities, not directly here
  // unless this DTO is simplified and intended for a list view only.
  // If this DTO should include the template content, add corresponding @ApiProperty fields.

  constructor(document: ReasoningTemplateDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON();

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation using toHexString() for consistency.
    this._id = plainObject._id.toHexString();
    this.name = plainObject.name;
    this.description = plainObject.description;
    this.activatedReasoningThinkingId = plainObject.activatedReasoningThinkingId ? plainObject.activatedReasoningThinkingId.toHexString() : undefined;
    this.status = plainObject.status;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;

    // Map other properties if you added them to the DTO and Schema
  }
}