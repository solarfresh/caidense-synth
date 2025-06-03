import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { Document, Types } from 'mongoose';


export interface PromptSet extends Document {
  /**
   * A human-readable name for the prompt set
   * (e.g., "Customer Service Chatbot Prompts", "Email Summarization Flow Prompts").
   */
  name: string;

  /**
   * Optional detailed description of the set's purpose, the task it supports, or the scenario it's used for.
   */
  description?: string;

  /**
   * Optional tags for categorization and searching Prompt Sets.
   */
  tags?: string[];

  /**
   * An array of IDs refering to PromptTextDocument
   */
  promptTextIds: Types.ObjectId[];

  /**
   * The status of this specific prompt set definition (e.g., draft, published, archived).
   * A published set version is considered stable and ready for production use.
   */
  status: DocumentStatus; // 例如：draft, published, archived

  /**
   * Timestamp when the template was first created.
   */
  createdAt: Date;

  /**
   * Timestamp when the template's metadata was last updated
   * (e.g., name or description changed, but not the definition).
   */
  updatedAt: Date;
}
