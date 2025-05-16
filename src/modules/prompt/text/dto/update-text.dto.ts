import { DocumentStatus, Variable } from '@/modules/base/base.interface';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty, // Decorator to validate that a string, array, object, etc., is not empty
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum
} from 'class-validator';

export class UpdatePromptTextDto {
  @IsOptional()
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
  @IsString()
  promptText?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  variables?: Variable[];

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}