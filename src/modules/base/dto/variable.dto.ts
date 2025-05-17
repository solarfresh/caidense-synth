import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty

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
  defaultValue?: any; // Assuming default value is optional and can be any type

  @ApiProperty({ description: 'The timestamp when this variable was created.' })
  createdAt: Date; // Assuming timestamps are tracked for variables

  @ApiProperty({ description: 'The timestamp when this variable was last updated.' })
  updatedAt: Date; // Assuming timestamps are tracked for variables

  // Add a constructor if you need to map from a source object
  constructor(data: any) { // 'any' or a more specific source type
    this._id = data._id; // Assuming _id is directly available or mapped
    this.name = data.name;
    this.type = data.type;
    this.description = data.description;
    this.required = data.required;
    this.defaultValue = data.defaultValue;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}