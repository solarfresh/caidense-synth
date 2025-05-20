import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVariableDto } from '@/modules/base/dto/update-variable.dto';


/**
 * Defines the data structure for updating an existing Reasoning Node document.
 * All fields are optional for partial updates.
 */
export class UpdateReasoningNodeDto {
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
    description: 'Optional script code to be executed by this node type.',
    required: false,
    example: 'let sum = a + b; return sum > 150;'
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