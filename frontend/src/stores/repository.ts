import type { Prompt } from '@/types/prompts';
import type { Repository } from '@/types/repositories';
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
    updateAllPrompts(data: Prompt[]) {
      data.map(prompt => {
        if (this.prompts.has(prompt.promptSetId)) {
          this.prompts.get(prompt.promptSetId)?.push(prompt);
        } else {
          this.prompts.set(prompt.promptSetId, [prompt]);
        }
      });
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