import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
// Removed unused Optional from @nestjs/common
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty
import {
  IsArray,
  IsEnum,
  IsOptional, // Decorator to validate that a value is optional
  IsString
} from 'class-validator';


export class UpdatePromptSetDto {
  @ApiProperty({
    description: 'Optional new name for the prompt set.',
    required: false, // Explicitly mark as optional for update DTO
    example: 'Vision Setting Prompts v2', // Add an example
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Optional new description for the prompt set.',
    required: false, // Explicitly mark as optional
    example: 'Updated set focusing on refinement steps.', // Add an example
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Optional new list of tags for categorizing the prompt set.',
    required: false, // Explicitly mark as optional
    isArray: true, // Explicitly mark as an array
    example: ['vision', 'refinement'], // Add an example
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Optional array of updated or new prompt entries for this set.',
    required: false, // Explicitly mark as optional
    isArray: true, // Explicitly mark as an array
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  promptTextIds?: string[]; // This field is optional

  @ApiProperty({
    description: 'Optional new publishing status for the prompt set.',
    required: false, // Explicitly mark as optional
    enum: DocumentStatus, // Reference the enum
    example: DocumentStatus.DRAFT, // Add an example
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  // Note: Fields like 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}