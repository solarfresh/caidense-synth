import type { Block, CreateBlock, UpdateBlock } from '@/types/blocks';
import type { GenAIRequest } from '@/types/genai';
import type { CreatePrompt, Prompt, UpdatePrompt } from '@/types/prompts';
import type { CreateRepository, Repository, UpdateRepository } from '@/types/repositories';
import type { CreateExecution, CreateThinking, CreateWorkflow, UpdateThinking, Workflow } from '@/types/workflow';
import axios, { AxiosResponse } from 'axios';
import { GenAIEndPoints, NodeEndpoints, PromptEndpoints, RepositoryEndpoints, WorkflowEndpoints } from './endpoints';


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  genai: {
    GoogleAIStudio: (data: GenAIRequest): Promise<AxiosResponse> => {
      return apiClient.post(GenAIEndPoints.GoogleAIStudio(), data);
    },
  },
  block: {
    getAll: (filter?: any): Promise<AxiosResponse<Block[]>> => {
      return apiClient.get(NodeEndpoints.getAll(), {params: filter});
    },
    create: (data: CreateBlock): Promise<AxiosResponse<Block>> => {
      return apiClient.post(NodeEndpoints.create(), data);
    },
    get: (nodeId: string): Promise<AxiosResponse<Block>> => {
      return apiClient.get(NodeEndpoints.get(nodeId));
    },
    update: (nodeId: string, data: UpdateBlock): Promise<AxiosResponse<Block>> => {
      return apiClient.put(NodeEndpoints.update(nodeId), data);
    },
    delete: (nodeId: string): Promise<AxiosResponse<void>> => {
      return apiClient.delete(NodeEndpoints.delete(nodeId));
    }
  },
  prompt: {
    getAll: (filter?: any): Promise<AxiosResponse<Prompt[]>> => {
      return apiClient.get(PromptEndpoints.getAll(), {params: filter});
    },
    create: (data: CreatePrompt): Promise<AxiosResponse<Prompt>> => {
      return apiClient.post(PromptEndpoints.create(), data);
    },
    get: (promptId: string): Promise<AxiosResponse<Prompt>> => {
      return apiClient.get(PromptEndpoints.get(promptId));
    },
    update: (promptId: string, data: UpdatePrompt): Promise<AxiosResponse<Prompt>> => {
      return apiClient.put(PromptEndpoints.update(promptId), data);
    },
    delete: (promptId: string): Promise<AxiosResponse<void>> => {
      return apiClient.delete(PromptEndpoints.delete(promptId));
    }
  },
  repository: {
    getAll: (filter?: any): Promise<AxiosResponse<Repository[]>> => {
      return apiClient.get(RepositoryEndpoints.getAll(), {params: filter});
    },
    create: (data: CreateRepository): Promise<AxiosResponse<Repository>> => {
      return apiClient.post(RepositoryEndpoints.create(), data);
    },
    get: (repositoryId: string): Promise<AxiosResponse<Repository>> => {
      return apiClient.get(RepositoryEndpoints.get(repositoryId));
    },
    update: (repositoryId: string, data: UpdateRepository): Promise<AxiosResponse<Repository>> => {
      return apiClient.put(RepositoryEndpoints.update(repositoryId), data);
    },
    delete: (repositoryId: string): Promise<AxiosResponse<void>> => {
      return apiClient.delete(RepositoryEndpoints.delete(repositoryId));
    }
  },
  workflow: {
    getAll: (filter?: any): Promise<AxiosResponse<Workflow[]>> => {
      return apiClient.get(WorkflowEndpoints.getAll(), {params: filter});
    },
    create: (data: CreateWorkflow): Promise<AxiosResponse<Workflow>> => {
      return apiClient.post(WorkflowEndpoints.create(), data);
    },
    get: (templateId: string, filter?: any): Promise<AxiosResponse<Workflow>> => {
      return apiClient.get(WorkflowEndpoints.get(templateId), {params: filter});
    },
    createThinking: (templateId: string, data: CreateThinking): Promise<AxiosResponse<Workflow>> => {
      return apiClient.post(WorkflowEndpoints.createThinking(templateId), data);
    },
    updateThinking: (templateId: string, data: UpdateThinking): Promise<AxiosResponse<Workflow>> => {
      return apiClient.put(WorkflowEndpoints.updateThinking(templateId), data);
    },
    executeWorkflow: (data: CreateExecution): Promise<AxiosResponse<{[key: string]: any}>> => {
      return apiClient.post(WorkflowEndpoints.executeWorkflow(), data);
    },
  }
}