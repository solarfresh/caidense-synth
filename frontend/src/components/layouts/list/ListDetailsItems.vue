<script setup lang="ts">
import { ListDetailsItems } from '@/types/list';
import { ExclamationCircleIcon, PencilIcon, PlayIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { formatDistanceToNow } from 'date-fns';
import CreateButton from '@/components/base/buttons/CreateButton.vue';


const props = defineProps({
  items: {
    type: Array<ListDetailsItems>,
    default: []
  },
  itemsName: {
    type: String,
    required: true
  },
  itemsTitle: {
    type: String,
    default: ''
  },
  createButtonName: {
    type: String,
    required: true
  },
  hasTestButton: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'test', id: string): void;
  (e: 'view', id: string): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">{{ itemsTitle }}</h2>
    <CreateButton @click="$emit('create')" :button-name="createButtonName" />
  </div>

  <div v-if="items.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
    <ExclamationCircleIcon class="h-10 w-10 text-gray-400 mx-auto mb-4" />
    <p class="text-lg mb-2">No {{ itemsName }} found in this repository.</p>
    <p class="text-sm">Start by adding a new one above!</p>
  </div>

  <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 h-80 overflow-y-auto">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="item in items" :key="item.id" class="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            <a href="#" @click.prevent="$emit('view', item.id)" class="hover:text-indigo-600">{{ item.name }}</a>
          </h3>
          <p class="text-sm text-gray-600 line-clamp-1">{{ item.description || 'No description provided.' }}</p>
          <div class="text-xs text-gray-500 mt-1">
            Last Modified: {{ formatDistanceToNow(item.updatedAt) }} ago
          </div>
        </div>
        <div class="flex space-x-2">
          <button @click="$emit('edit', item.id)" class="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-gray-100 transition"><PencilIcon class="h-5 w-5" /></button>
          <button v-if="hasTestButton" @click="$emit('test', item.id)" class="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-gray-100 transition"><PlayIcon class="h-5 w-5" /></button>
          <button @click="$emit('delete', item.id)" class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"><TrashIcon class="h-5 w-5" /></button>
        </div>
      </li>
    </ul>
  </div>
</template>