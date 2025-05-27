import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { UpdateVariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { UpdateExecutionEdgeDto } from '@caidense/reasoning/edge/dto/update-edge.dto';
import { UpdateExecutionNodeDto } from '@caidense/reasoning/node/dto/update-node.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';


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
    type: [UpdateExecutionNodeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExecutionNodeDto)
  nodes?: UpdateExecutionNodeDto[];

  @ApiProperty({
    description: 'The edges of the reasoning thinking, which is required.',
    type: [UpdateExecutionEdgeDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExecutionEdgeDto)
  edges?: UpdateExecutionEdgeDto[];

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
    example: DocumentStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;
  // Note: Fields like 'status', 'updatedAt', 'updatedAt', or internal IDs (_id)
  // are typically managed by the backend service and the database,
  // and thus are not included in the DTO used for *creating* the resource.
}