import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Defines the data structure for representing a node in a thinking flow diagram in API responses.
 */
export class ReasoningThinkingNodeDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the node.',
    example: 'reactflow__node-1',
  })
  _id: string;

  @ApiProperty({
    description: 'The type of the node (e.g., default, input, output, or custom types like promptNode, logicNode).',
    example: 'promptNode',
  })
  type: string;

  @ApiProperty({
    description: 'The label or text displayed on the node (Optional).',
    required: false,
    example: 'Initial Prompt',
  })
  label?: string;

  @ApiProperty({
    description: 'Optional configuration object specific to the node type.',
    required: false,
    // The example structure will depend heavily on specific node types.
    // This is a generic example.
    example: { promptId: 'abc123xyz456', parameters: { temperature: 0.7 } },
  })
  @Type(() => Object)
  config?: object;

  @ApiProperty({ description: 'The timestamp when this node was created.' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when this node was last updated.' })
  @Type(() => Date)
  updatedAt: Date;

  // Assuming the source object is a Mongoose Document or a plain object derived from one
  // Replace `any` with a more specific type if you have a dedicated Node Document type
  constructor(document: any) {
    const plainObject = document.toJSON ? document.toJSON() : document; // Handle Mongoose document or plain object

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation if _id is an ObjectId in the source
    this._id = plainObject._id ? plainObject._id.toHexString() : undefined;
    this.type = plainObject.type;
    this.label = plainObject.label;
    // Direct mapping for the config object
    this.config = plainObject.config;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}