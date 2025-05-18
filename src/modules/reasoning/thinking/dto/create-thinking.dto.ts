import { DocumentStatus } from '@/modules/base/base.interface'; // Importing the DocumentStatus enum from the base interfaces
import { CreateVariableDto } from '@/modules/base/dto/create-variable.dto';
import { CreateReasoningNodeDto } from '@/modules/reasoning/node/dto/create-node.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';


export class CreateReasoningThinkingEdgeDto {

  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @IsString()
  target: string;

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

export class CreateReasoningThinkingDto {

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningNodeDto)
  nodes: CreateReasoningNodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReasoningThinkingEdgeDto)
  edges: CreateReasoningThinkingEdgeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  inputs: CreateVariableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  outputs: CreateVariableDto[];

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