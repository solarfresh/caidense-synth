import type { DocumentStatus, Variable } from '@/types/common';


export interface CreateRepository {
  name: string;
  description: string;
  prompts: string[];
  tags: string[];
}

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


export interface RecentTestSummary {
  passRate: number;
  totalTests: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  recentTestSummary?: RecentTestSummary;
}

export interface UpdatePrompt {
  name?: string;
  description?: string;
  tags?: string[];
  promptText?: string;
  variables?: Variable[];
  status?: DocumentStatus;
}

export interface UpdateRepository {
  name?: string;
  description?: string;
  prompts?: string[];
  updatedAt?: Date;
  tags?: string[];
  recentTestSummary?: RecentTestSummary;
}