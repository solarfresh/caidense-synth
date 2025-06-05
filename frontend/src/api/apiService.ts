import type { GenAIRequest } from '@/types/genai';
import type { CreatePrompt, Prompt, UpdatePrompt } from '@/types/prompts';
import type { CreateRepository, Repository, UpdateRepository } from '@/types/repositories';
import axios, { AxiosResponse } from 'axios';
import { GenAIEndPoints, PromptEndpoints, RepositoryEndpoints } from './endpoints';


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
}