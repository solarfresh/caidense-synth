<script setup lang="ts">
import { apiService } from '@/api/apiService';
import TableCell from '@/components/layouts/table/TableCell.vue';
import TableSection from '@/components/layouts/table/TableSection.vue';
import Container from '@/components/shared/Container.vue';
import { useWorkflowStore } from '@/stores/workflow';
import type { Workflow } from '@/types/workflow';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const store = useWorkflowStore();

const searchQuery = ref('');
const selectedStatus = ref('');
const sortBy = ref('name');

const workflows = ref<Workflow[]>([]);

onMounted(() => {
  fetchWorkflows();
})

const fetchWorkflows = async () => {
  try {
    const response = await apiService.workflow.getAll();
    workflows.value = response.data;
    store.updateWorkflows(workflows.value);
  } catch (error) {
    console.error('Error fetching workflows:', error)
  }
};

const goToCreateWorkflow = () => {
  router.push({ name: 'CreateWorkflow' });
};

const goToWorkflowDetail = (workflowId: string) => {
  store.$state.currentWorkflowId = workflowId;
  router.push({ name: 'WorkflowDetail', params: { id: workflowId }})
}
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
            <TableSection
              :columns="['Name', 'Status', 'Created At', 'Modified At']"
              :items="workflows"
              @edit="goToWorkflowDetail"
            >
              <template #cell="{ item }">
                  <TableCell @click="goToWorkflowDetail(item.id)" :content="item?.name" :custom-class="'font-medium text-gray-900'" />
                  <TableCell
                    :content="item?.status"
                    :custom-class="'text-gray-500 uppercase'"
                    :high-light-class="item.status === 'completed' ? 'bg-green-100 text-green-800' : item.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'"
                  />
                  <TableCell :content="format(item?.createdAt || new Date(), 'MMM d, yyyy')" :custom-class="'text-gray-500'" />
                  <TableCell :content="format(item?.updatedAt || new Date(), 'MMM d, yyyy')" :custom-class="'text-gray-500'" />
              </template>
            </TableSection>
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>
