import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { CreateVariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { CreateExecutionEdgeDto } from '@caidense/reasoning/edge/dto/create-edge.dto';
import { CreateExecutionNodeDto } from '@caidense/reasoning/node/dto/create-node.dto';
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
    type: [CreateExecutionNodeDto],
    isArray: true,
  })
  @Type(() => CreateExecutionNodeDto)
  nodes: CreateExecutionNodeDto[];

  @ApiProperty({
    description: 'An array of edges connecting nodes within the thinking flow diagram.',
    type: [CreateExecutionEdgeDto],
    isArray: true,
  })
  @Type(() => CreateExecutionEdgeDto)
  edges: CreateExecutionEdgeDto[];

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