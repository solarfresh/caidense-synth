// src/reasoning/reasoning-strategy.repository.ts

import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// Import the ReasoningStrategy class from your schema file
import { ReasoningStrategy } from '../database/schemas/reasoning-strategy.schema';

/**
 * @summary Repository for managing ReasoningStrategy documents in the database.
 * @description Handles data access operations for Reasoning Strategy entities,
 * providing an abstraction layer over Mongoose Model interactions.
 */
@Injectable()
export class ReasoningStrategyRepository {
  /**
   * @param reasoningStrategyModel Mongoose Model injected for ReasoningStrategy.
   */
  constructor(@InjectModel(ReasoningStrategy.name) private reasoningStrategyModel: Model<ReasoningStrategy>) {} // Using ReasoningStrategy.name is safer than hardcoding string 'ReasoningStrategy'

  /**
   * @summary Finds a single reasoning strategy document by its unique ID.
   * @description Retrieves a specific reasoning strategy record from the database using its identifier.
   * @param id The unique identifier of the strategy (typically string or ObjectId).
   * @returns A Promise resolving to the ReasoningStrategy document if found, otherwise null.
   */
  async findById(id: string): Promise<ReasoningStrategy | null> {
    // .exec() ensures a true Promise is returned
    return this.reasoningStrategyModel.findById(id).exec();
  }

  /**
   * @summary Retrieves all reasoning strategy documents.
   * @description Fetches all stored reasoning strategy records from the database.
   * @returns A Promise resolving to an array of ReasoningStrategy documents.
   */
  async findAll(): Promise<ReasoningStrategy[]> {
    return this.reasoningStrategyModel.find().exec();
  }

  /**
   * @summary Creates a new reasoning strategy document.
   * @description Inserts a new reasoning strategy record into the database with the provided data.
   * @param strategyData The data object containing the properties for the new strategy.
   * @returns A Promise resolving to the newly created ReasoningStrategy document.
   */
  async create(strategyData: Partial<ReasoningStrategy>): Promise<ReasoningStrategy> {
    const createdStrategy = new this.reasoningStrategyModel(strategyData);
    return createdStrategy.save();
    // Alternative: return this.reasoningStrategyModel.create(strategyData); // Mongoose Model.create() returns a Promise of the document(s)
  }

  /**
   * @summary Updates an existing reasoning strategy document.
   * @description Finds and updates a reasoning strategy record by its ID with the provided data.
   * Returns the updated document.
   * @param id The unique identifier of the strategy to update.
   * @param updateData The data object containing the properties to update.
   * @returns A Promise resolving to the updated ReasoningStrategy document, or null if the strategy was not found.
   */
  async update(id: string, updateData: Partial<ReasoningStrategy>): Promise<ReasoningStrategy | null> {
    // { new: true } option returns the modified document rather than the original
    return this.reasoningStrategyModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  /**
   * @summary Deletes a reasoning strategy document.
   * @description Removes a reasoning strategy record from the database by its ID.
   * @param id The unique identifier of the strategy to delete.
   * @returns A Promise resolving to true if a document was found and deleted, false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    // Mongoose deleteOne/findByIdAndDelete returns a result object
    const deleteResult = await this.reasoningStrategyModel.findByIdAndDelete(id).exec();
    return deleteResult !== null; // Check if a document was actually found and deleted
  }

  // --- Potentially other query methods ---

  /**
   * @summary Finds reasoning strategy documents based on a query filter.
   * @description Retrieves multiple reasoning strategy records matching the given criteria.
   * @param filter The query filter object (Mongoose query syntax).
   * @returns A Promise resolving to an array of matching ReasoningStrategy documents.
   */
  // async find(filter: any): Promise<ReasoningStrategy[]> {
  //   return this.reasoningStrategyModel.find(filter).exec();
  // }

  /**
   * @summary Counts the number of reasoning strategy documents matching a filter.
   * @description Counts how many strategy records satisfy the provided criteria.
   * @param filter The query filter object.
   * @returns A Promise resolving to the number of matching documents.
   */
  // async count(filter?: any): Promise<number> {
  //   return this.reasoningStrategyModel.countDocuments(filter).exec();
  // }
}