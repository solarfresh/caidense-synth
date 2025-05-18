import { DocumentStatus } from '@/modules/base/base.interface'; // Importing the DocumentStatus enum from the base interfaces
import { UpdateVariableDto } from '@/modules/base/dto/update-variable.dto';
import { UpdateReasoningNodeDto } from '@/modules/reasoning/node/dto/update-node.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';


export class UpdateReasoningThinkingEdgeDto {

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @IsOptional()
  @IsString()
  target?: string;

  @IsOptional()
  @IsString()
  targetHandle?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  label?: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}

export class UpdateReasoningThinkingDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningNodeDto)
  nodes?: UpdateReasoningNodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningThinkingEdgeDto)
  edges?: UpdateReasoningThinkingEdgeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  inputs?: UpdateVariableDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  outputs?: UpdateVariableDto[];

  @IsOptional()
  @IsString()
  reasoningTemplateId?: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'updatedAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}