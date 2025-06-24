import type { Block } from '@/types/blocks';
import { defineStore } from 'pinia';


export const useBlocktStore = defineStore('block', {
  state: () => {
    return {
      blocks: new Map<string, Block>(),
      currentBlockId: ''
    }
  },
  actions: {
    updateState(data: any) {
      this.$patch(data);
    },
    updateBlocks(data: Block[]){
      data.map(block => {
        this.blocks.set(block.id, block);
      });
    }
  },
  getters: {
    getBlock: (state): Block | null => {
      return state.blocks.get(state.currentBlockId) || null;
    }
  }
});