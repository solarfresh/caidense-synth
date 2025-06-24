import { CreateVariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';


/**
 * Defines the data structure for creating a new Reasoning Node document.
 * Excludes backend-generated fields like _id and timestamps.
 */
export class CreateReasoningNodeDto {
  @ApiProperty({
    description: 'A readable name for the block.',
    example: 'LLM Call',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'To describe the purpose or functionality of the block.',
    example: 'Invoke a Large Language Model with a prompt template.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The type of the node, determining its function and behavior in the flow.',
    example: 'systemLogic',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'An optional label or name displayed on the node.',
    required: false,
    example: 'Calculate & Compare Sum',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Optional configuration object specific to the node type.',
    required: false,
    example: { logicType: 'sumAndCompare', threshold: 100 },
  })
  @IsOptional()
  @IsObject()
  config?: object;

  @ApiProperty({
    description: 'Optional array defining the inputs specific to this node\'s logic.',
    type: [CreateVariableDto],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  inputs?: CreateVariableDto[];

  @ApiProperty({
    description: 'Optional array defining the outputs specific to this node\'s logic.',
    type: [CreateVariableDto],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariableDto)
  outputs?: CreateVariableDto[];
}