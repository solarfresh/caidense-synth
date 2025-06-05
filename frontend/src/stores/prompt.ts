import type { Prompt } from '@/types/prompts';
import { defineStore } from 'pinia';


export const usePromptStore = defineStore('prompt', {
  state: () => {
    return {
      prompts: new Map<string, Prompt>(),
      currentPromptId: ''
    }
  },
  actions: {
    updateState(data: any) {
      this.$patch(data);
    },
    updatePrompts(data: Prompt[]){
      data.map(prompt => {
        this.prompts.set(prompt.id, prompt);
      });
    }
  },
  getters: {
    getPrompt: (state): Prompt | null => {
      return state.prompts.get(state.currentPromptId) || null;
    }
  }
});