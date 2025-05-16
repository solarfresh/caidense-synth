import { DocumentStatus, Variable } from '@/modules/base/base.interface';
import { PromptTextDocument } from '../text.schemas';


export class PromptTextDto {
  _id: string;
  name: string;
  description?: string;
  tags?: string[];
  promptText: string;
  variables: Variable[];
  status: DocumentStatus; // Use the enum type
  createdAt: Date; // Timestamps are typically represented as Date objects
  updatedAt: Date; // Timestamps are typically represented as Date objects

  constructor(document: PromptTextDocument) {
    // Use document.toJSON() to get a plain object that includes virtuals
    // and excludes internal Mongoose properties like __v by default.
    const plainObject = document.toJSON();

    // Map properties from the plain object to the DTO instance.
    // Convert ObjectId to string representation.
    this._id = plainObject._id.toHexString();
    this.name = plainObject.name;
    this.description = plainObject.description;
    this.tags = plainObject.tags;
    this.promptText = plainObject.promptText;
    this.variables = plainObject.variables;
    this.status = plainObject.status.toString(); // Convert status to string if it's an enum
    this.createdAt = plainObject.createdAt;
    this.updatedAt = plainObject.updatedAt;

    // Map other properties if you added them to the DTO
    // this.someOtherField = plainObject.someOtherField;
  }
}