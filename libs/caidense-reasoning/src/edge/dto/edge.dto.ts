import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class ExecutionEdgeDto {
  @ApiProperty({
    description: 'The unique identifier for the edge.',
    example: '60c8d6c1f5a4c8a7f0b1c2d6', // Example of MongoDB ObjectId string
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the source node from which this edge originates.',
    example: '60c8d6c1f5a4c8a7f0b1c2d6', // Example of MongoDB ObjectId string
  })
  @Type(() => String)
  source: string;

  @ApiProperty({
    description: 'The ID of the target node where this edge ends.',
    example: '60c8d6c1f5a4c8a7f0b1c2d7', // Example of MongoDB ObjectId string
  })
  @Type(() => String)
  target: string;

  @ApiProperty({
    description: 'Optional: The specific handle/port ID on the source node where the edge starts.',
    required: false,
    example: 'outputHandle1',
  })
  @Type(() => String)
  sourceHandle?: string;

  @ApiProperty({
    description: 'Optional: The specific handle/port ID on the target node where the edge ends.',
    required: false,
    example: 'inputHandle1',
  })
  @Type(() => String)
  targetHandle?: string;

  @ApiProperty({
    description: 'Optional: The type of the edge (e.g., "default", "conditional-true", "conditional-false").',
    required: false,
    example: 'default',
  })
  @Type(() => String)
  type?: string;

  @ApiProperty({
    description: 'Optional label for the edge (e.g., condition expression for conditional edges).',
    required: false,
    example: 'Condition met',
  })
  @Type(() => String)
  label?: string;

  constructor(document: any) {
    const plainObject = document.toJSON ? document.toJSON() : document;

    this._id = plainObject._id?.toHexString ? plainObject._id.toHexString() : plainObject.id ? plainObject.id : plainObject._id;
    this.source = plainObject.source.toHexString ? plainObject.source.toHexString() : plainObject.source;
    this.target = plainObject.target.toHexString ? plainObject.target.toHexString() : plainObject.target;
    this.sourceHandle = plainObject.sourceHandle;
    this.targetHandle = plainObject.targetHandle;
    this.type = plainObject.type;
    this.label = plainObject.label;
  }
}
