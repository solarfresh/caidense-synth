import {
  IsString,       // Decorator to validate that a property is a string
  IsOptional,     // Decorator to validate that a property is optional (can be undefined or null)
  IsEnum,         // Decorator to validate that a property's value is one of the values in an enum
} from 'class-validator';
import { DocumentStatus } from '@/modules/base/base.interface'; // Importing the DocumentStatus enum from the base interfaces
import { ApiProperty } from '@nestjs/swagger'; // Importing ApiProperty for Swagger documentation


export class UpdateReasoningTemplateDto {
  @ApiProperty({
      description: 'The name of the reasoning template, which is optional.',
      example: 'My Reasoning Template',
  })
  @IsOptional()
  @IsString()
  name?: string;

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

  @ApiProperty({
      description: 'The status of the reasoning template, which is optional.',
      enum: DocumentStatus,
      example: DocumentStatus.Draft,
  })
  @IsOptional()         // This field is not required for an update operation
  @IsEnum(DocumentStatus) // If present, validate that its value is one of the DocumentStatus enum members
  status?: DocumentStatus; // Use the enum type, and '?' as the field is optional

  // Note: Fields like 'organizationId', 'createdAt', 'updatedAt', or the document's _id
  // are typically not updated via this DTO. The organizationId is part of the resource
  // and is usually not modified. The createdAt and updatedAt fields are managed by the
  // backend service and the database, and the _id is the unique identifier for the document.
 }