<script setup lang="ts">
import type { Block } from '@/types/blocks';


const props = defineProps<{
  blocks: Block[];
}>();

const emits = defineEmits<{
  (e: 'dragstart', event: DragEvent, type: string): void;
}>();
</script>

<template>
  <aside>
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Block Library</h2>
    <div class="space-y-2">
      <button v-for="block in blocks" class="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200 cursor-grab" :draggable="true" @dragstart="(event) => $emit('dragstart', event, 'inputData')">
        {{ block.name }}
      </button>
    </div>
      <!-- <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">Output Node</div> -->
  </aside>
</template>