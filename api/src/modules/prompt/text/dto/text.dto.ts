import { DocumentStatus } from '@/modules/base/base.interface';
import { PromptTextDocument } from '../text.schemas'; // Assuming the corresponding Mongoose schema file is 'text.schemas.ts'
import { VariableDto } from '@/modules/base/dto/variable.dto'; // Assuming this DTO exists and is correctly defined
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

/**
 * Defines the data structure for representing a single Prompt Text document in API responses.
 * This contains the actual prompt content and its metadata.
 */
export class PromptTextDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the prompt text document.',
    example: '60c8d6c1f5a4c8a7f0b1c2d3', // Example of MongoDB ObjectId string
  })
  _id: string;

  @ApiProperty({ description: 'The name of the prompt text document.' })
  name: string; // Assuming name is required in the schema

  @ApiProperty({
    description: 'A brief description of the prompt text document (Optional).',
    required: false, // It's optional in the schema
  })
  description?: string; // Assuming description is optional

  @ApiProperty({
    description: 'A list of tags for categorizing the prompt text document (Optional).',
    required: false, // It's optional in the schema
    isArray: true, // Explicitly mark as an array
  })
  tags?: string[]; // Assuming tags is optional

  @ApiProperty({ description: 'The actual text content of the prompt.' })
  promptText: string; // Assuming promptText is required in the schema

  @ApiProperty({
    description: 'An array of variables used within the prompt text.',
    type: [VariableDto], // Reference the nested DTO for variables
    isArray: true, // Explicitly mark as an array
  })
  variables: VariableDto[]; // Assuming variables is required (or defaults to []) in the schema

  @ApiProperty({
    description: 'The publishing status of the prompt text document (draft or finalized).',
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.Finalized,
  })
  status: DocumentStatus; // Use the enum type (Assuming status is required or defaults in schema)

  @ApiProperty({ description: 'The timestamp when the prompt text document was created.' })
  createdAt: Date; // Assuming timestamps are enabled and required in response

  @ApiProperty({ description: 'The timestamp when the prompt text document was last updated.' })
  updatedAt: Date; // Assuming timestamps are enabled and required in response

  // The constructor maps data from the Mongoose Document to the DTO instance.
  constructor(document: PromptTextDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON ? document.toJSON() : document; // Handle case if document is already plain object

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation.
    this._id = plainObject._id ? plainObject._id.toHexString() : undefined; // Check _id existence and convert
    this.name = plainObject.name;
    this.description = plainObject.description;
    this.tags = plainObject.tags;
    this.promptText = plainObject.promptText;
    // Assuming plainObject.variables is an array of objects that can be mapped to VariableDto
    this.variables = plainObject.variables ? plainObject.variables.map(v => new VariableDto(v)) : []; // Example mapping nested DTOs
    this.status = plainObject.status; // status should be the enum value directly from Mongoose
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}