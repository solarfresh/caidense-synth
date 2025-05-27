import {
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional, // Decorator to mark a property as optional in the payload
  IsString // Decorator to validate that a property is a string
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

/**
 * Defines the data structure for creating a single entry within a Prompt Set's 'prompts' array.
 * This DTO is used in the CreatePromptSetDto.
 */
export class CreatePromptSetEntryDto {
  @ApiProperty({
    description: 'The role of the prompt entry in the conversation (e.g., system, user, assistant).',
    example: 'user', // Add an example for clarity
    // 'required' is true by default if not marked with @IsOptional and @ApiProperty.required is not set to false
  })
  @IsString()
  @IsNotEmpty({ message: 'role statement is required' }) // Ensures the string is not empty after validation
  role: string;

  @ApiProperty({
    description: 'A brief description or note about the prompt entry (Optional).',
    required: false, // Explicitly mark as not required in Swagger
    example: 'Instructions for the user input step.', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  description?: string; // TypeScript optional property

  @ApiProperty({
    description: 'The unique identifier (ID) of the associated prompt template.',
    example: '60b8d6c... (MongoDB ObjectId)', // Add an example, indicating format
    // 'required' is true by default
  })
  @IsString() // Validates that the property is a string
  @IsNotEmpty({ message: 'promptTemplateId statement is required' }) // Ensures the string is not empty
  promptTemplateId: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // for the entry itself are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource via API payload.
}