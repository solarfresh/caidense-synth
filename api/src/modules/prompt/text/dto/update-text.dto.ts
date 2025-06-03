import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { UpdateVariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { Type } from 'class-transformer';
import {
  IsArray, // Decorator to validate nested objects or array of objects
  IsEnum, // Decorator to validate that a string, array, object, etc., is not empty (less common in update DTOs)
  IsOptional, // Decorator to mark a property as optional in the payload
  IsString, // Decorator to validate that a property is a string
  ValidateNested
} from 'class-validator';

/**
 * Defines the data structure for updating an existing Prompt Text document.
 * This DTO is used as the request body for updating a prompt text resource.
 */
export class UpdatePromptTextDto {
  @ApiProperty({
    description: 'Optional new name for the prompt text document.',
    required: false, // Explicitly mark as not required for update DTO
    example: 'Customer Greeting Prompt v2', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  name?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new description for the prompt text document.',
    required: false, // Explicitly mark as not required
    example: 'Second version with updated greeting message.', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  description?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new list of tags for categorizing the prompt text document.',
    required: false, // Explicitly mark as not required
    isArray: true, // Explicitly mark as an array
    example: ['greeting', 'customer', 'v2'], // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsArray() // Validates that the value, if present, is an array
  @IsString({ each: true }) // Validates that each item in the array is a string
  tags?: string[]; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new actual text content of the prompt.',
    required: false, // Explicitly mark as not required
    example: 'Hi {{userName}}! How can I assist you today?', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  promptText?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional array of variables to update or add.',
    required: false, // Explicitly mark as not required
    type: [UpdateVariableDto], // Reference the nested DTO for variables
    isArray: true, // Explicitly mark as an array
    // Note: Complex array updates (add/remove/update specific items by ID)
    // often require custom logic in the service layer. This DTO structure
    // typically implies sending the *full* desired state of the array or
    // relies on specific backend handling for array operations.
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsArray() // Validates that the value, if present, is an array
  @ValidateNested({ each: true }) // Validates each object in the array against the specified DTO
  @Type(() => UpdateVariableDto) // Corrected: Ensure class-transformer knows the type of nested objects
  variables?: UpdateVariableDto[]; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new publishing status for the prompt text document.',
    required: false, // Explicitly mark as not required
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.DRAFT, // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsEnum(DocumentStatus) // Validates that the value, if present, is one of the enum values
  status?: DocumentStatus; // TypeScript optional property

  @ApiProperty({
    description: '',
    required: false, // Explicitly mark as not required
  })
  @IsOptional()
  @IsString() // Validates that the property is a string
  promptSetId: string;
  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id) of the *document*
  // are typically managed by the backend service and the database, and not included here.
}