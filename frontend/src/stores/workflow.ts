import type { Workflow } from '@/types/workflow';
import { defineStore } from 'pinia';


export const useWorkflowStore = defineStore('workflow', {
  state: () => {
    return {
      workflows: new Map<string, Workflow>(),
      currentWorkflowId: ''
    }
  },
  actions: {
    updateState(data: any) {
      this.$patch(data);
    },
    updateWorkflows(data: Workflow[]){
      data.map(workflow => {
        this.workflows.set(workflow.id, workflow);
      });
    }
  },
  getters: {
    getCurrentWorkflow: (state): Workflow | null => {
      return state.workflows.get(state.currentWorkflowId) || null;
    }
  }
});