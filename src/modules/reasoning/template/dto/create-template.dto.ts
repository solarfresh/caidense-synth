import {
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateReasoningTemplateDto {
  @ApiProperty({
      description: 'The name of the reasoning template, which is required.',
      example: 'My Reasoning Template',
  })
  @IsString()
  @IsNotEmpty({ message: 'name statement is required' })
  name: string;

  @ApiProperty({
    description: 'The description of the reasoning template, which is optional.',
    example: 'This is a sample reasoning template.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The ID of the thinking template associated with this reasoning template, which is optional.',
    example: 'thinking-template-id',
  })
  @IsOptional()
  @IsString()
  thinkingId?: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}