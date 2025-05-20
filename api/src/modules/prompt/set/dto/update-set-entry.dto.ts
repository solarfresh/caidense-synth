// Removed unused Optional from @nestjs/common
import {
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty (often used in creation DTOs, less common in update DTOs where IsOptional is used)
  IsOptional, // Decorator to mark a property as optional in the payload
  IsString // Decorator to validate that a property is a string
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

/**
 * Defines the data structure for updating a single entry within a Prompt Set's 'prompts' array.
 * This DTO is typically used within the UpdatePromptSetDto.
 */
export class UpdatePromptSetEntryDto {
  // NOTE: A common pattern for updating items within an array
  // is to include the item's ID so the backend knows which item to update.
  // If your Mongoose subdocument schema has an _id, you might add it here:
  // @ApiProperty({ description: 'The unique identifier (ID) of the entry to update.', example: '60b8d6c... (MongoDB ObjectId)' })
  // @IsString()
  // @IsNotEmpty() // Often required for array updates
  // _id: string;

  @ApiProperty({
    description: 'Optional new role for the prompt entry.',
    required: false, // Explicitly mark as not required for update DTO
    example: 'assistant', // Add an example for clarity
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  role?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new description for the prompt entry.',
    required: false, // Explicitly mark as not required
    example: 'Revised instructions.', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  description?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new unique identifier (ID) of the associated prompt template.',
    required: false, // Explicitly mark as not required
    example: '60b8d6e... (Another MongoDB ObjectId)', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  promptTemplateId?: string; // TypeScript optional property

  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id)
  // for the entry itself are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
  // However, the entry's _id is often *needed* for updating it in an array (see comment above).
}