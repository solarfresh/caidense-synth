import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DocumentStatus } from '@/modules/base/base.interface';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ReasoningThinkingDocument } from '../thinking.schemas';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';


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
    description: 'The specific handle/port ID on the source node where the edge starts.',
    example: 'true',
  })
  sourceHandle?: string;

  @ApiProperty({
    description: 'The ID of the target node for this edge.',
    example: 'node-targetB',
  })
  target: string;

  @ApiProperty({
    description: 'The specific handle/port ID on the target node where the edge ends.',
    example: 'false',
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

/**
 * Defines the data structure for representing a complete Reasoning Thinking document (flow) in API responses.
 */
export class ReasoningThinkingDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the reasoning thinking flow document.',
    example: '60c8d6c1f5a4c8a7f0b1c2d5',
  })
  _id: string;

  @ApiProperty({ description: 'The name of the reasoning thinking flow.' })
  name: string;

  @ApiProperty({
    description: 'A brief description of the reasoning thinking flow (Optional).',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'An array of nodes within the thinking flow diagram.',
    type: [ExecutionNodeDto],
    isArray: true,
  })
  @Type(() => ExecutionNodeDto)
  nodes: ExecutionNodeDto[];

  @ApiProperty({
    description: 'An array of edges connecting nodes within the thinking flow diagram.',
    type: [ReasoningThinkingEdgeDto],
    isArray: true,
  })
  @Type(() => ReasoningThinkingEdgeDto)
  edges: ReasoningThinkingEdgeDto[];

  @ApiProperty({
    description: 'An array of input variables defined for the thinking flow.',
    type: [VariableDto],
    isArray: true,
  })
  @Type(() => VariableDto)
  inputs: VariableDto[];

  @ApiProperty({
    description: 'An array of output variables defined for the thinking flow.',
    type: [VariableDto],
    isArray: true,
  })
  @Type(() => VariableDto)
  outputs: VariableDto[];

  @ApiProperty({
    description: 'The ID of the associated reasoning template document.',
    example: '60c8d6c1f5a4c8a7f0b1c2d3',
  })
  reasoningTemplateId: string;

  @ApiProperty({
    description: 'The publishing status of the reasoning thinking flow document.',
    enum: DocumentStatus,
    example: DocumentStatus.Finalized,
  })
  status: DocumentStatus;

  @ApiProperty({ description: 'The timestamp when the reasoning thinking flow document was created.' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'The timestamp when the reasoning thinking flow was last updated.' })
  @Type(() => Date)
  updatedAt: Date;


  constructor(document: ReasoningThinkingDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON();

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation using toHexString() for consistency.
    this._id = plainObject._id.toHexString();
    this.name = plainObject.name;
    this.description = plainObject.description;

    this.nodes = plainObject.nodes ? plainObject.nodes.map(node => new ExecutionNodeDto(node)) : [];
    this.edges = plainObject.edges ? plainObject.edges.map(edge => new ReasoningThinkingEdgeDto(edge)) : [];
    this.inputs = plainObject.inputs ? plainObject.inputs.map(input => new VariableDto(input)) : [];
    this.outputs = plainObject.outputs ? plainObject.outputs.map(output => new VariableDto(output)) : [];

    this.reasoningTemplateId = plainObject.reasoningTemplateId ? plainObject.reasoningTemplateId.toHexString() : undefined;
    this.status = plainObject.status;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}