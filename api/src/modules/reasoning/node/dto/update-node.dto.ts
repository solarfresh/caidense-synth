import { UpdateVariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';


/**
 * Defines the data structure for updating an existing Reasoning Node document.
 * All fields are optional for partial updates.
 */
export class UpdateReasoningNodeDto {
  @ApiProperty({
    description: 'A readable name for the block.',
    example: 'LLM Call',
  })
  @IsOptional()
  @IsString()
  name?: string;

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
    required: false
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'An optional label or name displayed on the node.',
    required: false,
    example: 'Updated Label',
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: 'Optional configuration object specific to the node type.',
    required: false,
    example: { threshold: 150 },
  })
  @IsOptional()
  @IsObject()
  config?: object;

  @ApiProperty({
    description: 'Optional array defining the inputs specific to this node\'s logic.',
    type: [UpdateVariableDto],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  inputs?: UpdateVariableDto[];

  @ApiProperty({
    description: 'Optional array defining the outputs specific to this node\'s logic.',
    type: [UpdateVariableDto],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariableDto)
  outputs?: UpdateVariableDto[];
}