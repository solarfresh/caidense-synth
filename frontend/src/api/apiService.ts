import axios, { AxiosResponse } from 'axios';
import { RepositoryEndpoints } from './endpoints';
import type { CreateRepository, Repository, UpdateRepository } from '@/types/repositories';


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  repository: {
    getAll: (): Promise<AxiosResponse<Repository[]>> => {
      return apiClient.get(RepositoryEndpoints.getAll())
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