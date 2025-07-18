import { DocumentStatus, Variable } from '@caidense/reasoning/common/common.interface';
import { Document, Types } from 'mongoose';


export interface PromptText extends Document {
  /**
   * A human-readable name for the template.
   */
  name: string;

  /**
   * Optional detailed description of the template's purpose.
   */
  description?: string;

  /**
   * Optional tags for categorization and searching (e.g., ['marketing', 'customer-service', 'summarization']).
   */
  tags?: string[];

  /**
   * The actual text of the prompt template, including placeholders for variables (e.g., "Hello, {{name}}!").
   */
  promptText: string;

  /**
   * An array defining the variables expected in the promptText.
   */
  variables: Variable[];

  /**
   * Status of the template metadata itself.
   * This indicates the overall availability of the template.
   */
  status: DocumentStatus;

  /**
   *
   */
  promptSetId: Types.ObjectId;

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
