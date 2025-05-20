import {
  IsBoolean, // Decorator to validate that a property is a boolean
  IsOptional, // Decorator to mark a property as optional in the payload
  IsString // Decorator to validate that a property is a string
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

/**
 * Defines the data structure for updating a single Variable within a Prompt Text's 'variables' array.
 * This DTO is typically used within the UpdatePromptTextDto.
 */
export class UpdateVariableDto {
  // NOTE: A common pattern for updating items within an array
  // is to include the item's ID so the backend knows which item to update.
  // If your Variable schema has an _id, you might add it here:
  // @ApiProperty({ description: 'The unique identifier (ID) of the variable to update.', example: 'var_abc123def456' })
  // @IsString()
  // @IsNotEmpty() // Often required for array updates
  // _id: string;

  @ApiProperty({
    description: 'Optional new name for the variable.',
    required: false, // Explicitly mark as not required for update DTO
    example: 'updatedUserName', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  name?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new data type for the variable.',
    required: false, // Explicitly mark as not required
    example: 'number', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  type?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new description for the variable.',
    required: false, // Explicitly mark as not required
    example: 'Revised description for the user name variable.', // Add an example
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsString() // Validates that the value, if present, is a string
  description?: string; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new required status for the variable.',
    required: false, // Explicitly mark as not required
    example: false,
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  @IsBoolean() // Validates that the value, if present, is a boolean
  required?: boolean; // TypeScript optional property

  @ApiProperty({
    description: 'Optional new default value for the variable.',
    required: false, // Explicitly mark as not required
    example: 'Anonymous', // Example default value
    // Note: 'any' type is hard to represent precisely in Swagger,
    // you might want to specify specific types or provide examples.
  })
  @IsOptional() // Allows this field to be missing in the incoming payload
  defaultValue?: any; // TypeScript optional property

  // Note: Fields like 'createdAt', 'updatedAt', are managed by the backend.
  // The entry's _id is often *needed* for updating it in an array (see comment above).
}