import type { CreateVariable, DocumentStatus, Variable } from '@/types/common';


export interface CreatePrompt {
  name: string;
  description?: string;
  tags?: string[];
  promptText: string;
  variables: CreateVariable[];
  status: DocumentStatus;
  promptSetId: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  promptText: string;
  variables: Variable[];
  status: DocumentStatus;
  promptSetId: string;
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
  promptSetId?: string;
}
