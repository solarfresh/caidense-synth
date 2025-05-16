import { DocumentStatus } from '@/modules/base/base.interface';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { UpdatePromptSetEntryDto } from './update-prompt-set-entry.dto';


export class UpdatePromptSetDto {
  @Optional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  prompts?: UpdatePromptSetEntryDto[];

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}