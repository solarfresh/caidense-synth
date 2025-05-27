import { DocumentStatus } from '@caidense/reasoning/common/common.interface';
import { Document, Types } from 'mongoose';


export interface ReasoningTemplate extends Document {
  /**
   * A human-readable name for the template.
   */
  name: string;

  /**
   * Optional detailed description of the template's purpose.
   */
  description?: string;

  /**
   *
   */
  activatedReasoningThinkingId?: Types.ObjectId

  /**
   *
   */
  status: DocumentStatus;

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
