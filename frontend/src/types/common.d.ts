export interface Variable {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  systemRef?: string
}

export enum DocumentStatus {
  DRAFT = 'draft',
  FINALIZED = 'finalized',
}
