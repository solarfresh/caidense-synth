import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVariableDto } from '@caidense/reasoning/common/dto/common.dto';


/**
 * Defines the data structure for creating a new Reasoning Node document.
 * Excludes backend-generated fields like _id and timestamps.
 */
export class UpdateExecutionNodeDto {
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
    description: 'Optional script code to be executed by this node type.',
    required: false,
    example: 'let sum = a + b; return sum > 100;'
  })
  @IsOptional()
  @IsString()
  script?: string;

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