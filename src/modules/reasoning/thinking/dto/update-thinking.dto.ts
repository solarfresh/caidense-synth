import { DocumentStatus } from '@/modules/base/base.interface'; // Importing the DocumentStatus enum from the base interfaces
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { UpdateReasoningThinkingEdgeDto } from './update-edge.dto';
import { UpdateReasoningThinkingNodeDto } from './update-node.dto';
import { UpdateReasoningThinkingVariableDto } from './update-variable.dto';


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
  @Type(() => UpdateReasoningThinkingNodeDto)
  nodes?: UpdateReasoningThinkingNodeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningThinkingEdgeDto)
  edges?: UpdateReasoningThinkingEdgeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningThinkingVariableDto)
  inputs?: UpdateReasoningThinkingVariableDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningThinkingVariableDto)
  outputs?: UpdateReasoningThinkingVariableDto[];

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