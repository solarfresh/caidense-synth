<script setup>
import { ref, computed } from 'vue';

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

const filteredWorkflows = computed(() => {
  return workflows.value
    .filter(workflow => workflow.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(workflow => !selectedStatus.value || workflow.status === selectedStatus.value)
    .sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy.value === 'lastModifiedDesc') {
        return new Date(b.modifiedAt) - new Date(a.modifiedAt);
      } else if (sortBy.value === 'createdAtDesc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="flex-grow container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Workflows</h1>
        <div class="flex items-center">
          <button
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out mr-4"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Create New Workflow
          </button>
          <button
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="-ml-1 mr-2 h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v6m-3-3L12 15m3-3l1.5 3M6.75 7.5h5.25M6 12h9" />
            </svg>
            Prompt Templates
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <div class="md:col-span-3">
          <div v-if="filteredWorkflows.length === 0" class="text-center py-10 text-gray-600">
            <p class="text-lg">No workflows found.</p>
            <p class="text-sm mt-2">Click "Create New Workflow" to get started!</p>
          </div>

          <div v-else class="bg-white shadow-md rounded-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified At</th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="workflow in filteredWorkflows" :key="workflow.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ workflow.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      workflow.status === 'Active' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    ]">
                      {{ workflow.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(workflow.createdAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(workflow.modifiedAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.708 5.23 5.23 0 015.894-5.894 10.815 10.815 0 010 2.121 5.23 5.23 0 01-5.894 5.894z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.964 11.678a1.012 1.012 0 010 .708 5.23 5.23 0 01-5.894 5.894 10.815 10.815 0 010-2.121 5.23 5.23 0 015.894-5.894z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </a>
                    <a href="#" class="text-indigo-600 hover:text-indigo-900 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v5h-5l-0.322-0.322" />
                      </svg>
                    </a>
                    <button class="text-red-600 hover:text-red-900 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 inline-block">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.162m-9.968 0c-.342-.052-.682-.107-1.022-.162m0 0a3 3 0 10-5.136-3.643M12 12a3 3 0 00-3 3V16a3 3 0 003 3m0 0a3 3 0 013-3V13a3 3 0 01-3-3m0 0c.008-.21.015-.42.022-.632" />
                      </svg>
                    </button>
                  </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
