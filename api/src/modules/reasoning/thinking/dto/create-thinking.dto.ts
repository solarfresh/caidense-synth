import { CreateVariableDto } from '@/modules/base/dto/create-variable.dto';
import { CreateReasoningNodeDto } from '@/modules/reasoning/node/dto/create-node.dto';
import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'The ID of the source node',
    example: 'source-node-id',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'The specific handle/port ID on the source node where the edge starts.',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  sourceHandle?: string;

  @ApiProperty({
    description: 'The ID of the target node',
    example: 'target-node-id',
  })
  @IsString()
  target: string;

  @ApiProperty({
    description: 'The specific handle/port ID on the target node where the edge ends.',
    example: 'false',
  })
  @IsOptional()
  @IsString()
  targetHandle?: string;

  @ApiProperty({
    description: 'The type of the edge, which is optional.',
    example: 'default',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'The label of the edge, which is optional.',
    example: 'Edge Label',
  })
  @IsOptional()
  @IsString()
  label?: string;

  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}

export class CreateReasoningThinkingDto {

  @ApiProperty({
    description: 'The name of the reasoning thinking, which is required.',
    example: 'My Reasoning Thinking',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the reasoning thinking, which is optional.',
    example: 'This is a sample reasoning thinking.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'An array of nodes within the thinking flow diagram.',
    type: [CreateReasoningNodeDto],
    isArray: true,
  })
  @Type(() => CreateReasoningNodeDto)
  nodes: CreateReasoningNodeDto[];

  @ApiProperty({
    description: 'An array of edges connecting nodes within the thinking flow diagram.',
    type: [CreateReasoningThinkingEdgeDto],
    isArray: true,
  })
  @Type(() => CreateReasoningThinkingEdgeDto)
  edges: CreateReasoningThinkingEdgeDto[];

  @ApiProperty({
    description: 'An array of input variables defined for the thinking flow.',
    type: [CreateVariableDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  inputs: CreateVariableDto[];

  @ApiProperty({
    description: 'The array of output variables defined for the thinking flow.',
    type: [CreateVariableDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  outputs: CreateVariableDto[];

  @ApiProperty({
    description: 'The ID of the associated reasoning template document.',
    example: 'reasoning-template-id',
  })
  @IsString()
  @IsNotEmpty({ message: 'reasoningTemplateId is required' }) // Custom error message example
  reasoningTemplateId: string;

  @ApiProperty({
    description: 'The publishing status of the reasoning thinking, which is optional.',
    required: false,
    enum: DocumentStatus,
    example: DocumentStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'createdAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}