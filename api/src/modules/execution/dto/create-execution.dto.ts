import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsNotEmpty, // Decorator to mark a property as optional in the payload
  IsString,
  IsOptional
} from 'class-validator';


/**
 * Defines the data structure for creating a new Prompt Text document.
 * This DTO is used as the request body for creating a prompt text resource.
 */
export class CreateExecutionDto {
  @ApiProperty({
    description: 'The ID of the thinking process to be executed.',
    example: '1234567890abcdef12345678', // Add an example
    // 'required' is true by default
  })
  @IsString()
  @IsNotEmpty({ message: 'thinkingId statement is required' }) // Ensures the string is not empty
  thinkingId: string;

  @IsOptional()
  config?: object;

  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource via API payload.
}