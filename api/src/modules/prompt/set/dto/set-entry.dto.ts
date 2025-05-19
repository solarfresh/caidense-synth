import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
// Note: This DTO is likely used for representing the data shape
// of elements within the 'prompts' array in a response DTO like PromptSetDto.
// It does not typically include class-validator or class-transformer
// decorators unless also used in a validation scenario (like for updating nested items).


export class PromptSetEntryDto {
  @ApiProperty({ description: 'The unique identifier (ID) for this specific entry within the set.' })
  _id: string;

  @ApiProperty({ description: 'The role of this prompt entry in the conversation (e.g., system, user, assistant).' })
  role: string; // Assuming this is required for a valid entry

  @ApiProperty({ description: 'The unique identifier (ID) of the prompt template associated with this entry.' })
  promptTemplateId: string; // Assuming this is required for a valid entry

  @ApiProperty({ description: 'An optional description or note for this specific prompt entry.', required: false })
  description?: string; // Assuming this is optional

  @ApiProperty({ description: 'The timestamp when this prompt entry was created.' })
  createdAt: Date; // Assuming timestamps are tracked for subdocuments

  @ApiProperty({ description: 'The timestamp when this prompt entry was last updated.' })
  updatedAt: Date; // Assuming timestamps are tracked for subdocuments

  // Add a constructor if you need to map from a Mongoose subdocument plain object
  constructor(entry: any) { // 'any' or a more specific type reflecting the Mongoose subdocument plain object structure
      this._id = entry._id ? entry._id.toHexString() : undefined;
      this.role = entry.role;
      this.promptTemplateId = entry.promptTemplateId.toHexString();
      this.description = entry.description;
      this.createdAt = entry.createdAt;
      this.updatedAt = entry.updatedAt;
  }
}