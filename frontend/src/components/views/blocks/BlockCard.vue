<script setup lang="ts">
import type { Block } from '@/types/blocks';
import { formatDistanceToNow } from 'date-fns'; // Using date-fns for date formatting


const props = defineProps<{
  block: Block;
}>();

const emits = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
    <div class="p-6 flex-grow">
      <h3 class="text-xl font-semibold text-gray-900 mb-2 truncate">
        <a href="#" class="hover:text-indigo-600">
          {{ block.name }}
        </a>
      </h3>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ block.description || 'No description provided.' }}</p>

      <div class="text-sm text-gray-500 mb-2">
        <span v-if="block.updatedAt">Last Modified: <span class="font-medium text-gray-700">{{ formatDistanceToNow(block.updatedAt) }} ago</span></span>
      </div>
    </div>

    <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
      <button
        @click="$emit('edit', block.id)"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out"
      >
        Edit
      </button>
      <button
        @click="$emit('delete', block.id)"
        class="text-sm font-medium text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition duration-150 ease-in-out"
      >
        Delete
      </button>
    </div>
  </div>
</template>
