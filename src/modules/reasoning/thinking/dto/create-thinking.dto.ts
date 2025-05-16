import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum
} from 'class-validator';
import { CreateReasoningThinkingEdgeDto } from './create-edge.dto';
import { CreateReasoningThinkingNodeDto } from './create-node.dto';
import { CreateReasoningThinkingVariableDto } from './create-variable.dto';
import { DocumentStatus } from '@/modules/base/base.interface'; // Importing the DocumentStatus enum from the base interfaces


export class CreateReasoningThinkingDto {

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningThinkingNodeDto)
  nodes: CreateReasoningThinkingNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningThinkingEdgeDto)
  edges: CreateReasoningThinkingEdgeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningThinkingVariableDto)
  inputs: CreateReasoningThinkingVariableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningThinkingVariableDto)
  outputs: CreateReasoningThinkingVariableDto[];

  @IsString()
  @IsNotEmpty({ message: 'reasoningTemplateId is required' }) // Custom error message example
  reasoningTemplateId: string;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}