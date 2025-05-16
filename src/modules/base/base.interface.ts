import { Document } from 'mongoose';


// Define an interface for the service methods the generic controller expects.
// This ensures type safety when defining the generic constraint for the service S.
export interface BaseService<T extends Document> {
  // Method signatures the controller will call
  create(createDto: any): Promise<T>; // Use 'any' or a generic CreateDto type
  findAll(filter?: any): Promise<T[]>; // Use 'any' or a generic Filter type
  findById(id: string): Promise<T>;
  update(id: string, updateDto: any): Promise<T>; // Use 'any' or a generic UpdateDto type
  deleteOne(id: string): Promise<any>; // Or Promise<DeleteResult> or similar
}

export enum DocumentStatus {
  Draft = 'draft',
  Finalized = 'finalized',
}

/**
 * Defines the structure of a variable.
 */
export interface Variable {
  /**
   * The unique name of the variable within the scope (inputs or outputs).
   */
  name: string;

  /**
   * The expected data type of the variable (e.g., 'string', 'number', 'object', 'boolean', 'array', 'any').
   */
  type: string;

  /**
   * Optional description of the variable's purpose or content.
   */
  description?: string;

  /**
   * Optional: Indicates if this variable is required.
   */
  required?: boolean;

  /**
   * Optional: Default value for the variable if not provided.
   */
  defaultValue?: any;

  // Add validation rules, example values, etc., if needed
  // validation?: object;
  // example?: any;
}
