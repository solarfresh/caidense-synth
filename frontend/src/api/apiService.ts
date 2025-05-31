import axios, { AxiosResponse } from 'axios';
import { RepositoryEndpoints } from './endpoints';
import type { CreateRepository, Repository } from '@/types/repositories';


const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  repository: {
    get: (): Promise<AxiosResponse<Repository>> => {
      return apiClient.get(RepositoryEndpoints.get())
    },
    create: (data: CreateRepository): Promise<AxiosResponse<Repository>> => {
      return apiClient.post(RepositoryEndpoints.create(), data);
    },
    update: (repositoryId: string, data: Repository): Promise<AxiosResponse<Repository>> => {
      return apiClient.put(RepositoryEndpoints.update(repositoryId), data);
    },
    delete: (repositoryId: string): Promise<AxiosResponse<void>> => {
      return apiClient.delete(RepositoryEndpoints.delete(repositoryId));
    }
  },
}