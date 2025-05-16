// src/common/base/base.service.ts

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
// Import Document and Model from mongoose

/**
 * Generic Base Service providing common CRUD operations for Mongoose models.
 *
 * @template T - The Mongoose Document type (e.g., UserDocument, VisionDocument).
 * Must extend mongoose.Document.
 */
@Injectable() // Marked as Injectable so it can potentially be used directly or extended
export class BaseService<T extends Document> {
  // Protected property to hold the Mongoose Model instance.
  // 'protected' allows extending classes to access it if needed.
  protected model: Model<T>;

  /**
   * Constructor for the BaseService.
   * The specific Mongoose Model is injected by the extending class.
   * @param model The Mongoose Model for the specific document type T.
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Creates a new document in the database.
   * @param createDto - The data transfer object or partial document data for creation.
   * Uses Partial<T> for flexibility, but you might refine this
   * in extending services using specific DTOs.
   * @returns A Promise resolving to the created document.
   */
  async create(createDto: Partial<T>): Promise<T> {
    try {
      const createdDocument = new this.model(createDto);
      const savedDocument = await createdDocument.save();
      return savedDocument.toJSON() as T; // Save the document and return it
    } catch (error) {
      // Log or handle the error appropriately
      throw new InternalServerErrorException('Could not create the document.');
    }
  }

  /**
   * Finds all documents of this type.
   * @param filter - Optional filter query to apply.
   * @returns A Promise resolving to an array of documents.
   */
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      const documents = await this.model.find(filter).exec();
      return documents.map((doc) => doc.toJSON() as T); // Convert to JSON if needed
    } catch (error) {
      throw new InternalServerErrorException('Could not retrieve documents.');
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findOne(filter).exec();
      if (!document) {
        throw new NotFoundException('Document not found.');
      }
      return document.toJSON() as T; // Convert to JSON if needed
    } catch (error) {
      // Handle Mongoose casting errors or other errors
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not retrieve the document.');
    }
  }

  /**
   * Finds a single document by its ID.
   * @param id - The ID of the document to find.
   * @returns A Promise resolving to the found document.
   * @throws NotFoundException if the document with the given ID is not found.
   */
  async findById(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id).exec();
      if (!document) {
        throw new NotFoundException(`Document with ID "${id}" not found.`);
      }

      return document.toJSON() as T; // Convert to JSON if needed
    } catch (error) {
      // If error is already NotFoundException, re-throw it
      if (error instanceof NotFoundException) {
         throw error;
      }
      // Handle Mongoose casting errors or other errors
      throw new InternalServerErrorException(`Could not retrieve document with ID "${id}".`);
    }
  }

  /**
   * Updates a document found by its ID.
   * @param id - The ID of the document to update.
   * @param updateDto - The data transfer object or partial document data for update.
   * Uses UpdateQuery<T> for flexibility with Mongoose update operators,
   * or Partial<T> if only setting fields directly.
   * @returns A Promise resolving to the updated document.
   * @throws NotFoundException if the document with the given ID is not found.
   */
  async update(id: string, updateDto: UpdateQuery<T>): Promise<T> {
     try {
       // Use findByIdAndUpdate to find, update, and return the modified document
       // { new: true } ensures the updated document is returned
       const updatedDocument = await this.model
         .findByIdAndUpdate(id, updateDto as any, { new: true }) // Cast needed due to UpdateQuery complexity
         .exec();
       if (!updatedDocument) {
         throw new NotFoundException(`Document with ID "${id}" not found for update.`);
       }
       return updatedDocument.toJSON() as T; // Convert to JSON if needed
     } catch (error) {
        if (error instanceof NotFoundException) {
           throw error;
        }
       throw new InternalServerErrorException(`Could not update document with ID "${id}".`);
     }
  }

   /**
   * Deletes a document found by its ID.
   * @param id - The ID of the document to delete.
   * @returns A Promise resolving to the result of the delete operation.
   * @throws NotFoundException if the document with the given ID is not found.
   */
  async deleteOne(id: string): Promise<any> {
    try {
      const result = await this.model.deleteOne({ _id: id as any }).exec(); // Cast needed for _id string match
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Document with ID "${id}" not found for deletion.`);
      }
      return result; // Or return a success message/object
    } catch (error) {
       if (error instanceof NotFoundException) {
          throw error;
       }
       throw new InternalServerErrorException(`Could not delete document with ID "${id}".`);
    }
  }
  // Add more generic methods if needed, e.g., pagination, soft delete, etc.
}