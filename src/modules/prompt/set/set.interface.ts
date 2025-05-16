import { DocumentStatus } from '@/modules/base/base.interface';
import { Document, Types } from 'mongoose';


export interface PromptSetEntry {
  /**
   * The unique logical name or role of this prompt entry within the scope of its parent Prompt Set
   * (e.g., "initial-greeting", "answer-faq", "summarization-step-1", "error-handler").
   * This name is used to reference the prompt from within a Reasoning Flow or application logic.
   */
  role: string;

  /**
   * The ID of the specific Prompt Template that this entry refers to.
   * This provides the link to the overall template metadata.
   */
  promptTemplateId: Types.ObjectId;

  /**
   * Optional description of the role this prompt plays in the set or workflow.
   */
  description?: string;

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
   * An array of entries defining the specific prompt template versions included in this set, linked by their logical role.
   */
  prompts: PromptSetEntry[];

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
