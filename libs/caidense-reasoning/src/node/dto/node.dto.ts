import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';


/**
 * Defines the data structure for representing a Execution Node document in API responses.
 * This DTO is consistent with the ExecutionNode interface.
 */
export class ExecutionNodeDto {
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
    description: "An optional position object defining the node's coordinates in a visual layout.",
    required: false,
    example: { x: 10, y: 100 },
  })
  @Type(() => Object)
  position?: object;

  @ApiProperty({
    description: 'Optional configuration object specific to the node type.',
    required: false,
    // Use schema to provide a more specific structure example if possible
    example: { logicType: 'sumAndCompare', threshold: 100 },
  })
  @Type(() => Object)
  config?: object;

  @ApiProperty({
    description: 'Optional array of IDs representing the incoming sequence edges to this node.',
    type: [String],
    isArray: true,
    required: false,
  })
  @Type(() => String)
  incoming?: string[];

  @ApiProperty({
    description: 'Optional array defining the inputs specific to this node\'s logic.',
    type: [VariableDto],
    isArray: true,
    required: false,
  })
  @Type(() => VariableDto)
  inputs?: VariableDto[];

  @ApiProperty({
    description: 'Optional script code to be executed by this node type.',
    required: false,
    example: 'let sum = a + b; return sum > 100;'
  })
  script: string;

  @ApiProperty({
    description: 'Optional array of IDs representing the outgoing sequence edges from this node.',
    type: [String],
    isArray: true,
    required: false,
  })
  @Type(() => String)
  outgoing?: string[];

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

  constructor(document: any) {
    const plainObject = document.toJSON ? document.toJSON() : document;

    this._id = plainObject._id.toHexString();
    this.type = plainObject.type;
    this.label = plainObject.label;
    this.config = plainObject.config;
    this.incoming = plainObject.incoming ? plainObject.incoming.map(incoming => incoming.toHexString ? incoming.toHexString() : incoming) : [];
    this.inputs = plainObject.inputs ? plainObject.inputs.map(input => new VariableDto(input)) : [];
    this.script = plainObject.script;
    this.outgoing = plainObject.outgoing ? plainObject.outgoing.map(outgoing => outgoing.toHexString ? outgoing.toHexString() : outgoing) : [];
    this.outputs = plainObject.outputs ? plainObject.outputs.map(output => new VariableDto(output)) : [];
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}