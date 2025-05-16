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
import { CreatePromptSetEntryDto } from './create-prompt-set-entry.dto';


export class CreatePromptSetDto {
  @IsString()
  @IsNotEmpty({ message: 'name statement is required' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  prompts: CreatePromptSetEntryDto[];

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}