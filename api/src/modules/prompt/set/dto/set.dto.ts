import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { PromptSetDocument } from '../set.schemas';
import { PromptSetEntryDto } from './set-entry.dto'; // Assuming this DTO exists and is correctly defined


export class PromptSetDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the prompt set.',
    example: '60b8d6c1f5a4c8a7f0b1c2d3', // Example of MongoDB ObjectId string
  })
  _id: string;

  @ApiProperty({ description: 'The name of the prompt set.' })
  name: string;

  @ApiProperty({
    description: 'A brief description of the prompt set (Optional).',
    required: false, // It's optional in the schema, so optional in the response
  })
  description?: string;

  @ApiProperty({
    description: 'A list of tags for categorizing the prompt set (Optional).',
    required: false, // It's optional in the schema
    isArray: true, // Explicitly mark as an array
  })
  tags?: string[];

  @ApiProperty({
    description: 'An array of prompt entries included in this set.',
    type: [PromptSetEntryDto], // Reference the nested DTO
    isArray: true, // Explicitly mark as an array
  })
  prompts: PromptSetEntryDto[];

  @ApiProperty({
    description: 'The publishing status of the prompt set (draft or finalized).',
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.DRAFT,
  })
  status: DocumentStatus; // Use the enum type

  @ApiProperty({ description: 'The timestamp when the prompt set was created.' })
  createdAt: Date; // Timestamps are typically represented as Date objects

  @ApiProperty({ description: 'The timestamp when the prompt set was last updated.' })
  updatedAt: Date; // Timestamps are typically represented as Date objects

  constructor(document: PromptSetDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON ? document.toJSON() : document; // Handle case if document is already plain object

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation.
    this._id = plainObject._id ? plainObject._id.toHexString() : undefined; // Check _id existence
    this.name = plainObject.name;
    this.description = plainObject.description;
    this.tags = plainObject.tags;
    // Ensure prompts are mapped, potentially converting nested documents to DTOs if PromptSetEntryDto constructor expects it
    // This line assumes plainObject.prompts is an array of objects that can be used directly or mapped
    this.prompts = plainObject.prompts ? plainObject.prompts.map((entry) => new PromptSetEntryDto(entry)) : []; // Example mapping nested if needed
    this.status = plainObject.status; // status should be the enum value directly from Mongoose
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;

    // Map other properties if you added them to the DTO
    // this.someOtherField = plainObject.someOtherField;
  }
}