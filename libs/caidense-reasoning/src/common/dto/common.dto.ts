import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsBoolean,
  IsOptional,
  IsString
} from 'class-validator';


/**
 * Defines the data structure for representing a Variable used within a prompt text.
 * This DTO is typically part of the PromptTextDto.
 */
export class VariableDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the variable.',
    example: 'var_abc123def456', // Example variable ID format
  })
  _id: string; // Assuming variables have their own IDs

  @ApiProperty({
    description: 'The name of the variable as used within the prompt text (e.g., "{{userName}}").',
    example: 'userName', // Example of a variable name
  })
  name: string; // Assuming name is required

  @ApiProperty({
    description: 'The data type of the variable (e.g., string, number, boolean, object, array).',
    example: 'string', // Example data type
  })
  type: string; // Assuming type is required

  @ApiProperty({
    description: 'An optional description explaining the variable\'s purpose.',
    required: false, // Assuming description is optional
    example: 'The name of the user to personalize the response.',
  })
  description?: string; // Assuming description is optional

  @ApiProperty({
    description: 'Indicates if this variable is required when the prompt is used (Optional).',
    required: false, // Assuming required status is optional to define
    example: true,
  })
  required?: boolean; // Assuming required status can be optional to define

  @ApiProperty({
    description: 'An optional default value for the variable if not provided.',
    required: false, // Assuming default value is optional
    example: 'Guest', // Example default value
    // Note: 'any' type is hard to represent precisely in Swagger,
    // you might want to specify specific types or provide examples for common cases.
  })
  value?: any; // Assuming default value is optional and can be any type

  @ApiProperty({ description: 'The timestamp when this variable was created.' })
  createdAt: Date; // Assuming timestamps are tracked for variables

  @ApiProperty({ description: 'The timestamp when this variable was last updated.' })
  updatedAt: Date; // Assuming timestamps are tracked for variables

  // Add a constructor if you need to map from a source object
  constructor(document: any) { // 'any' or a more specific source type
    const plainObject = document.toJSON ? document.toJSON() : document;

    this._id = plainObject._id.toHexString(); // Assuming _id is directly available or mapped
    this.name = plainObject.name;
    this.type = plainObject.type;
    this.description = plainObject.description;
    this.required = plainObject.required;
    this.value = plainObject.value;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}

export class CreateVariableDto {

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsOptional()
  value?: any;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}

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
  value?: any; // TypeScript optional property

  // Note: Fields like 'createdAt', 'updatedAt', are managed by the backend.
  // The entry's _id is often *needed* for updating it in an array (see comment above).
}