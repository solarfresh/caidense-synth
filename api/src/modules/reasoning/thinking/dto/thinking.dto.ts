import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ExecutionEdgeDto } from '@caidense/reasoning/edge/dto/edge.dto';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ReasoningThinkingDocument } from '@caidense/reasoning/thinking/thinking.schemas';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


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
    description: "Map of node IDs to their corresponding ExecutionNode objects.",
  })
  @Type(() => Map<string, ExecutionNodeDto>)
  nodes: Map<string, ExecutionNodeDto>;

  @ApiProperty({
    description: "Map of edge IDs to their corresponding ExecutionEdge objects.",
  })
  @Type(() => Map<string, ExecutionEdgeDto>)
  edges: Map<string, ExecutionEdgeDto>;

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
    example: DocumentStatus.DRAFT,
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

    this.nodes = plainObject.nodes ? plainObject.nodes : new Map<string, ExecutionNodeDto[]>();
    this.edges = plainObject.edges ? plainObject.edges : new Map<string, ExecutionEdgeDto[]>();
    this.inputs = plainObject.inputs ? plainObject.inputs.map(input => new VariableDto(input)) : [];
    this.outputs = plainObject.outputs ? plainObject.outputs.map(output => new VariableDto(output)) : [];

    this.reasoningTemplateId = plainObject.reasoningTemplateId ? plainObject.reasoningTemplateId.toHexString() : undefined;
    this.status = plainObject.status;
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;
  }
}