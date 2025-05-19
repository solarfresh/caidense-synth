import { DocumentStatus } from '@/modules/base/base.interface';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import { CreatePromptSetEntryDto } from './create-set-entry.dto';


export class CreatePromptSetDto {
  @ApiProperty({
    description: 'The name of the prompt set.',
    example: 'Vision Setting Prompts v1', // Add an example
  })
  @IsString()
  @IsNotEmpty({ message: 'name statement is required' })
  name: string;

  @ApiProperty({
    description: 'A brief description of the prompt set (Optional).',
    required: false,
    example: 'Initial set of prompts for guiding vision setting conversations.', // Add an example
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'A list of tags for categorizing the prompt set (Optional).',
    required: false,
    isArray: true, // Explicitly mark as an array
    example: ['vision', 'guidance', 'drafting'], // Add an example
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'An array of prompt entries included in this set.',
    type: [CreatePromptSetEntryDto], // Reference the nested DTO
    isArray: true, // Explicitly mark as an array
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePromptSetEntryDto) // Make sure to use CreatePromptSetEntryDto here
  prompts: CreatePromptSetEntryDto[];

  @ApiProperty({
    description: 'The publishing status of the prompt set (Optional).',
    required: false,
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.Draft, // Add an example
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}