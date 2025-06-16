<script setup lang="ts">
import TableSection from '@/components/layouts/table/TableSection.vue';
import Container from '@/components/shared/Container.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const searchQuery = ref('');
const selectedStatus = ref('');
const sortBy = ref('name');

const workflows = ref([
  { id: 1, name: 'Text Summarization Workflow', status: 'Active', createdAt: '2025-06-01T10:00:00Z', modifiedAt: '2025-06-05T14:30:00Z' },
  { id: 2, name: 'Image Generation Pipeline', status: 'Active', createdAt: '2025-05-20T09:15:00Z', modifiedAt: '2025-06-10T11:00:00Z' },
  { id: 3, name: 'Sentiment Analysis Chain', status: 'Draft', createdAt: '2025-06-12T16:45:00Z', modifiedAt: '2025-06-12T16:45:00Z' },
  { id: 4, name: 'Translation Service', status: 'Inactive', createdAt: '2025-04-15T11:30:00Z', modifiedAt: '2025-05-01T08:00:00Z' },
  // Add more workflow data here
]);

const goToCreateWorkflow = () => {
  router.push({ name: 'CreateWorkflow' });
};
</script>

<template>
  <Container :page-title="'Workflows'" :create-button-name="'New Workflow'" @create="goToCreateWorkflow">
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<!--
        <aside class="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
          <div class="mb-4">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input
              type="text"
              id="search"
              v-model="searchQuery"
              placeholder="Search workflows..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div class="mb-4">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              v-model="selectedStatus"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sortBy"
              v-model="sortBy"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="name">Name (A-Z)</option>
              <option value="lastModifiedDesc">Last Modified (Newest First)</option>
              <option value="createdAtDesc">Created At (Newest First)</option>
            </select>
          </div>
        </aside>
 -->
        <div class="md:col-span-4">
          <div v-if="workflows.length === 0" class="text-center py-10 text-gray-600">
            <p class="text-lg">No workflows found.</p>
            <p class="text-sm mt-2">Click "Create New Workflow" to get started!</p>
          </div>

          <div v-else class="bg-white shadow-md rounded-md overflow-hidden">
            <TableSection :columns="['Name', 'Status', 'Created At', 'Modified At']" :items="workflows" :show-actions="true" />
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>
