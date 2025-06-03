<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'; // Using date-fns for date formatting
import type { Repository } from '@/types/repositories';
import { computed } from 'vue'


const props = defineProps<{
  repository: Repository;
}>();

const emits = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'view', id: string): void;
}>();

const promptCount = computed(() => {
  return props.repository.promptTextIds.length;
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
    <div class="p-6 flex-grow">
      <h3 class="text-xl font-semibold text-gray-900 mb-2 truncate">
        <a href="#" @click.prevent="$emit('view', repository.id)" class="hover:text-indigo-600">
          {{ repository.name }}
        </a>
      </h3>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ repository.description || 'No description provided.' }}</p>

      <div class="text-sm text-gray-500 mb-2">
        <span class="mr-3">Prompts: <span class="font-medium text-gray-700">{{ promptCount }}</span></span>
        <span v-if="repository.updatedAt">Last Modified: <span class="font-medium text-gray-700">{{ formatDistanceToNow(repository.updatedAt) }} ago</span></span>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in repository.tags"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
        >
          {{ tag }}
        </span>
      </div>

      <div v-if="repository.recentTestSummary" class="text-sm text-gray-600">
        <span :class="{'text-green-600': repository.recentTestSummary.passRate > 0.8, 'text-red-600': repository.recentTestSummary.passRate < 0.5, 'text-yellow-600': repository.recentTestSummary.passRate >= 0.5 && repository.recentTestSummary.passRate <= 0.8}">
          Latest Test Pass Rate: {{ (repository.recentTestSummary.passRate * 100).toFixed(0) }}%
        </span>
        ({{ repository.recentTestSummary.totalTests }} tests)
      </div>
    </div>

    <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
      <button
        @click="$emit('edit', repository.id)"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out"
      >
        Edit
      </button>
      <button
        @click="$emit('delete', repository.id)"
        class="text-sm font-medium text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition duration-150 ease-in-out"
      >
        Delete
      </button>
      <button
        @click="$emit('view', repository.id)"
        class="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition duration-150 ease-in-out"
      >
        View Prompts
      </button>
    </div>
  </div>
</template>
