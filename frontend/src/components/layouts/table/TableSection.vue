<script setup lang="ts">
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import EditButton from '@/components/base/buttons/EditButton.vue';
import ViewButton from '@/components/base/buttons/ViewButton.vue';
import { format } from 'date-fns';
import TableCell from './TableCell.vue';


const props = defineProps({
  columns: {
    type: Array<string>,
    required: true
  },
  items: {
    type: [Object],
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th v-for="col in columns" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ col }}</th>
        <th v-if="showActions" scope="col" class="relative px-6 py-3">
          <span class="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr v-for="workflow in items" :key="workflow.id">
        <TableCell :content="workflow.name" :custom-class="'font-medium text-gray-900'" />
        <TableCell
          :content="workflow.status"
          :custom-class="'text-gray-500'"
          :high-light-class="workflow.status === 'Active' ? 'bg-green-100 text-green-800' : workflow.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
        />
        <TableCell :content="format(workflow?.createdAt || new Date(), 'MMM d, yyyy')" :custom-class="'text-gray-500'" />
        <TableCell :content="format(workflow?.modifiedAt || new Date(), 'MMM d, yyyy')" :custom-class="'text-gray-500'" />
        <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <ViewButton :icon-only="true" class="mr-2" />
          <EditButton :icon-only="true" class="mr-2" />
          <DeleteButton :icon-only="true" />
        </td>
      </tr>
    </tbody>
  </table>
</template>