import { CreateVariableDto } from '@/modules/base/dto/create-variable.dto'; // Assuming this DTO exists and is correctly defined
import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { Type } from 'class-transformer';
import {
  IsArray, // Decorator to validate nested objects or array of objects
  IsEnum // Decorator to validate that a value is one of the values in an enum
  ,
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional, // Decorator to mark a property as optional in the payload
  IsString, // Decorator to validate that a property is a string
  ValidateNested
} from 'class-validator';

/**
 * Defines the data structure for creating a new Prompt Text document.
 * This DTO is used as the request body for creating a prompt text resource.
 */
export class CreatePromptTextDto {
  @ApiProperty({
    description: 'The name of the prompt text document.',
    example: 'Customer Greeting Prompt v1', // Add an example
    // 'required' is true by default
  })
  @IsString()
  @IsNotEmpty({ message: 'name statement is required' }) // Ensures the string is not empty
  name: string;

  @ApiProperty({
    description: 'A brief description of the prompt text document (Optional).',
    required: false, // Explicitly mark as not required
    example: 'Initial version of the prompt for greeting new customers.', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  description?: string; // TypeScript optional property

  @ApiProperty({
    description: 'A list of tags for categorizing the prompt text document (Optional).',
    required: false, // Explicitly mark as not required
    isArray: true, // Explicitly mark as an array
    example: ['greeting', 'customer', 'v1'], // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsArray() // Validates that the value, if present, is an array
  @IsString({ each: true }) // Validates that each item in the array is a string
  tags?: string[]; // TypeScript optional property

  @ApiProperty({
    description: 'The actual text content of the prompt, potentially including variable placeholders (e.g., "{{variableName}}").',
    example: 'Hello {{userName}}, how can I help you today?', // Add an example
    // 'required' is true by default
  })
  @IsNotEmpty({ message: 'promptText statement is required' }) // Ensures the string is not empty
  @IsString() // Validates that the property is a string
  promptText: string;

  @ApiProperty({
    description: 'An array of variables used within the prompt text.',
    type: [CreateVariableDto], // Reference the nested DTO for variables
    isArray: true, // Explicitly mark as an array
    // 'required' is true by default (even if array can be empty, the field itself must be present)
  })
  @IsArray() // Validates that the property is an array
  @ValidateNested({ each: true }) // Validates each object in the array against the specified DTO
  @Type(() => CreateVariableDto) // Corrected: Ensure class-transformer knows the type of nested objects for validation
  variables: CreateVariableDto[]; // TypeScript property

  @ApiProperty({
    description: 'The publishing status of the prompt text document (Optional).',
    required: false, // Explicitly mark as not required
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.DRAFT, // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsEnum(DocumentStatus) // Validates that the value, if present, is one of the enum values
  status?: DocumentStatus; // TypeScript optional property

  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource via API payload.
}