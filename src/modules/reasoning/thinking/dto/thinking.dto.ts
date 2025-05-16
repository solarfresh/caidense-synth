import { DocumentStatus } from '@/modules/base/base.interface';
import { VariableDto } from '../../../base/dto/variable.dto';
import { ReasoningThinkingDocument } from '../thinking.schemas';
import { ReasoningThinkingEdgeDto } from './edge.dto';
import { ReasoningThinkingNodeDto } from './node.dto';


export class ReasoningThinkingDto {
  _id: string;
  name: string;
  description?: string;
  nodes: ReasoningThinkingNodeDto[];
  edges: ReasoningThinkingEdgeDto[];
  inputs: VariableDto[];
  outputs: VariableDto[];
  reasoningTemplateId: string;
  status: DocumentStatus; // Use the enum type
  createdAt: Date; // Timestamps are typically represented as Date objects
  updatedAt: Date; // Timestamps are typically represented as Date objects

  constructor(document: ReasoningThinkingDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON();

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation.
    this._id = plainObject._id.toHexString();
    this.name = plainObject.name;
    this.description = plainObject.description;
    this.nodes = plainObject.nodes;
    this.edges = plainObject.edges;
    this.inputs = plainObject.inputs;
    this.outputs = plainObject.outputs;
    this.reasoningTemplateId = plainObject.reasoningTemplateId.toString();
    this.status = plainObject.status.toString(); // Convert status to string if it's an enum
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;

    // Map other properties if you added them to the DTO
    // this.someOtherField = plainObject.someOtherField;
  }
}