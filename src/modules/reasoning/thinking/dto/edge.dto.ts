import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Defines the data structure for representing an edge in a thinking flow diagram in API responses.
 */
export class ReasoningThinkingEdgeDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the edge.',
    example: 'reactflow__edge-sourceA-targetB', // Example of a typical React Flow edge ID
  })
  _id: string;

  @ApiProperty({
    description: 'The ID of the source node for this edge.',
    example: 'node-sourceA',
  })
  source: string;

  @ApiProperty({
    description: 'The handle ID on the source node (Optional).',
    required: false,
    example: 'handle-sourceA-bottom',
  })
  sourceHandle?: string;

  @ApiProperty({
    description: 'The ID of the target node for this edge.',
    example: 'node-targetB',
  })
  target: string;

  @ApiProperty({
    description: 'The handle ID on the target node (Optional).',
    required: false,
    example: 'handle-targetB-top',
  })
  targetHandle?: string;

  @ApiProperty({
    description: 'The type of the edge (e.g., default, smoothstep, buttonedge).',
    required: false,
    example: 'default',
  })
  type?: string;

  @ApiProperty({
    description: 'The label displayed on the edge (Optional).',
    required: false,
    example: 'Connects A to B',
  })
  label?: string;

  @ApiProperty({ description: 'The timestamp when this edge was created.' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when this edge was last updated.' })
  @Type(() => Date)
  updatedAt: Date;

  // Assuming the source object is a Mongoose Document or a plain object derived from one
  // Replace `any` with a more specific type if you have a dedicated Edge Document type
  constructor(document: any) {
    const plainObject = document.toJSON ? document.toJSON() : document; // Handle Mongoose document or plain object

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation if _id, source, target are ObjectIds in the source
    this._id = plainObject._id ? plainObject._id.toHexString() : undefined;
    this.source = plainObject.source ? (plainObject.source.toHexString ? plainObject.source.toHexString() : plainObject.source) : undefined; // Handle potential ObjectId or plain string
    this.sourceHandle = plainObject.sourceHandle;
    this.target = plainObject.target ? (plainObject.target.toHexString ? plainObject.target.toHexString() : plainObject.target) : undefined; // Handle potential ObjectId or plain string
    this.targetHandle = plainObject.targetHandle;
    this.type = plainObject.type;
    this.label = plainObject.label;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}