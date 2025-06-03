import type { DocumentStatus, Variable } from '@/types/common';


export interface CreatePrompt {
  name: string;
  description?: string;
  tags?: string[];
  promptText: string;
  variables: Variable[];
  status: DocumentStatus;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  promptText: string;
  variables: Variable[];
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePrompt {
  name?: string;
  description?: string;
  tags?: string[];
  promptText?: string;
  variables?: Variable[];
  status?: DocumentStatus;
}
