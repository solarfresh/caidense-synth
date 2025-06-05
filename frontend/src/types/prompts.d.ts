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

export interface EvaluationMetrics {
  prompt_template_clarity: number;
  prompt_template_completeness: number;
  ai_response_quality: number;
  ai_response_relevance: number;
  prompt_template_guidance: number;
  optimization_suggestions: Array<string>;
}

export interface EvaluationResult {
  llmResponse: string;
  evaluatorReport: EvaluationMetrics; // The summarized evaluation report from the evaluator LLM
  rawEvaluatorOutput: string; // The full raw output from the evaluator LLM (e.g., JSON)
  textGradInsights?: Array<{ text: string; score: number; }>; // TextGrad data [{text: 'word', score: 0.8}, {text: 'another', score: -0.2}]
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
