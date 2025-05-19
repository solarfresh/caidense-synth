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
import { ApiProperty } from '@nestjs/swagger';


export class UpdateReasoningThinkingEdgeDto {
  @ApiProperty({
    description: 'The ID of the source node',
    example: 'source-node-id',
  })
  @IsOptional()
  @IsString()
  source?: string;

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
  @IsOptional()
  @IsString()
  target?: string;

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

export class UpdateReasoningThinkingDto {
  @ApiProperty({
    description: 'The name of the reasoning thinking, which is required.',
    example: 'My Reasoning Thinking',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the reasoning thinking, which is optional.',
    example: 'This is a sample reasoning thinking.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The nodes of the reasoning thinking, which is required.',
    type: [UpdateReasoningNodeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningNodeDto)
  nodes?: UpdateReasoningNodeDto[];

  @ApiProperty({
    description: 'The edges of the reasoning thinking, which is required.',
    type: [UpdateReasoningThinkingEdgeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReasoningThinkingEdgeDto)
  edges?: UpdateReasoningThinkingEdgeDto[];

  @ApiProperty({
    description: 'An array of input variables defined for the thinking flow.',
    type: [UpdateVariableDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  inputs?: UpdateVariableDto[];

  @ApiProperty({
    description: 'An array of output variables defined for the thinking flow.',
    type: [UpdateVariableDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  outputs?: UpdateVariableDto[];

  @ApiProperty({
    description: 'The ID of the associated reasoning template document.',
    example: 'reasoning-template-id',
  })
  @IsOptional()
  @IsString()
  reasoningTemplateId?: string;

  @ApiProperty({
    description: 'The publishing status of the reasoning thinking flow document.',
    enum: DocumentStatus,
    example: DocumentStatus.Draft,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'updatedAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}