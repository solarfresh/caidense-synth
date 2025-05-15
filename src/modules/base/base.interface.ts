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
