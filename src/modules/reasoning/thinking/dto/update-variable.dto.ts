import {
  IsBoolean,
  IsOptional,
  IsString
} from 'class-validator';

export class UpdateReasoningThinkingVariableDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @IsOptional()
  defaultValue?: any;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}