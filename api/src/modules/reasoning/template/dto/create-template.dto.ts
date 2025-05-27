import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString,
} from 'class-validator';


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
  activatedReasoningThinkingId?: string;

  @ApiProperty({
    description: 'The publishing status of the reasoning template, which is optional.',
    required: false, // Explicitly mark as not required
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.DRAFT, // Add an example
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}