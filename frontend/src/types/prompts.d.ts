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

export interface EvaluationResult {
  llmResponse: string;
  evaluatorReport: string; // The summarized evaluation report from the evaluator LLM
  rawEvaluatorOutput: string; // The full raw output from the evaluator LLM (e.g., JSON)
  score: number; // Overall score (e.g., 1-5)
  textGradInsights?: Array<{ text: string; score: number; }>; // TextGrad data [{text: 'word', score: 0.8}, {text: 'another', score: -0.2}]
  optimizationSuggestions?: string; // Textual suggestions based on TextGrad
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
  variables?: CreateVariable[];
  status?: DocumentStatus;
  promptSetId?: string;
}
