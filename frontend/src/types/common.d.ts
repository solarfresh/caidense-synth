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
  DRAFT = 'draft',
  FINALIZED = 'finalized',
}
