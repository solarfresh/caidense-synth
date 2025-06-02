import type { Prompt, Repository } from '@/types/repositories';
import { defineStore } from 'pinia';


export const useRepositoryStore = defineStore('repository', {
  state: () => {
    return {
      repositories: new Map<string, Repository>(),
      prompts: new Map<string, Prompt[]>(),
      currentRepositoryId: ''
    }
  },
  actions: {
    updateState(data: any) {
      this.$patch(data);
    },
    updatePrompts(data: Prompt[]){
      this.prompts.set(this.currentRepositoryId, data)
    }
  },
  getters: {
    getPrompts: (state): Prompt[] => {
      return state.prompts.get(state.currentRepositoryId) || [];
    }
  }
});