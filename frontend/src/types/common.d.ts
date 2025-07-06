export interface CreateVariable {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  systemRef?: string;
  enumOptionsInput?: string;
  enumOptions?: string[];
}

export interface Variable {
  id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  systemRef?: string;
  enumOptionsInput?: string;
  enumOptions?: string[];
}

export enum DocumentStatus {
  COMPLETED = 'completed',
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  FAILED = 'failed'
}
