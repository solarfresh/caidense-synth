import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReasoningNode } from '../node.interface';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';

/**
 * Defines the data structure for representing a Reasoning Node document in API responses.
 * This DTO is consistent with the ReasoningNode interface.
 */
export class ReasoningNodeDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the node.',
    example: '60c8d6c1f5a4c8a7f0b1c2d6', // Example of MongoDB ObjectId string
  })
  _id: string;

  @ApiProperty({
    description: 'The type of the node, determining its function and behavior in the flow.',
    example: 'systemLogic',
  })
  type: string;

  @ApiProperty({
    description: 'An optional label or name displayed on the node.',
    required: false,
    example: 'Calculate & Compare Sum',
  })
  label?: string;

  @ApiProperty({
    description: 'Optional configuration object specific to the node type.',
    required: false,
    // Use schema to provide a more specific structure example if possible
    example: { logicType: 'sumAndCompare', threshold: 100 },
  })
  @Type(() => Object)
  config?: object;

  @ApiProperty({
    description: 'Optional array defining the inputs specific to this node\'s logic.',
    type: [VariableDto],
    isArray: true,
    required: false,
  })
  @Type(() => VariableDto)
  inputs?: VariableDto[];

  @ApiProperty({
    description: 'Optional array defining the outputs specific to this node\'s logic.',
    type: [VariableDto],
    isArray: true,
    required: false,
  })
  @Type(() => VariableDto)
  outputs?: VariableDto[];

  @ApiProperty({ description: 'The timestamp when the node was created.' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the node was last updated.' })
  @Type(() => Date)
  updatedAt: Date;

  constructor(document: ReasoningNode) {
    const plainObject = document.toJSON ? document.toJSON() : document;

    this._id = plainObject._id.toHexString();
    this.type = plainObject.type;
    this.label = plainObject.label;
    this.config = plainObject.config;
    this.inputs = plainObject.inputs ? plainObject.inputs.map(input => new VariableDto(input)) : [];
    this.outputs = plainObject.outputs ? plainObject.outputs.map(output => new VariableDto(output)) : [];
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}