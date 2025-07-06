<script setup lang="ts">
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import EditButton from '@/components/base/buttons/EditButton.vue';
import ViewButton from '@/components/base/buttons/ViewButton.vue';


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

const emits = defineEmits<{
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
  (e: 'delete'): void;
}>();
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
      <tr v-for="item in items" :key="item.id">
        <slot name="cell" :item="item" />
        <td v-if="showActions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <!-- <ViewButton :icon-only="true" class="mr-2" @click="$emit('view', item.id)" /> -->
          <EditButton :icon-only="true" class="mr-2" @click="$emit('edit', item.id)" />
          <DeleteButton :icon-only="true" @click="$emit('delete')" />
        </td>
      </tr>
    </tbody>
  </table>
</template>