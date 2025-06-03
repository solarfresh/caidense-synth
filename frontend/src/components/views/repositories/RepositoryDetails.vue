<script setup lang="ts">
import { apiService } from '@/api/apiService';
import ListDetails from '@/components/layouts/list/ListDetails.vue';
import { useRepositoryStore } from '@/stores/repository';
import type { Prompt } from '@/types/prompts';
import type { Repository } from '@/types/repositories';
import {
  ArrowPathIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns'; // For date formatting
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


// --- State Management ---
const route = useRoute();
const router = useRouter();
const store = useRepositoryStore();

const repository = ref<Repository | null>(null);
const isLoading = ref(true);
const promptCount = ref(0);
const prompts = ref<Prompt[]>([])

// --- Data Fetching ---
onMounted(async () => {
  const repositoryId = route.params.id as string;
  if (!repositoryId) {
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    let response = undefined

    await store.updateState({currentRepositoryId: repositoryId});
    repository.value = store.repositories.get(repositoryId) || null;
    if (repository.value === null) {
      response = await apiService.repository.get(repositoryId);
      repository.value = response.data;
    }
    promptCount.value = repository.value?.prompts.length || 0;
    prompts.value = store.getPrompts;
    if (prompts.value.length === 0) {
      response = await apiService.prompt.getAll({_id: {$in: repository.value?.prompts}});
      prompts.value = response.data || [];
      store.updatePrompts(prompts.value);
    }
  } catch (error) {
    console.error('Error fetching repository details:', error);
    repository.value = null; // Mark as not found on error
    alert('Failed to load repository details. Please try again.');
  } finally {
    isLoading.value = false;
  }
});

// --- Event Handlers / Actions ---
const handleEditRepository = () => {
  if (repository.value) {
    router.push({ name: 'EditRepository', params: { id: repository.value.id } });
  }
};

const handleDeleteCollection = async () => {
  if (!repository.value) return;

  if (confirm(`Are you sure you want to delete the repository "${repository.value.name}"? This action cannot be undone.`)) {
    console.log('Deleting repository:', repository.value.id);
    // In a real app: make API call to delete repository
    // await api.deleteCollection(repository.value.id);

    // After successful deletion, redirect to overview
    router.push({ name: 'RepositoryOverview' });
    alert(`Repository "${repository.value.name}" deleted successfully.`);
  }
};

const handleAddNewTemplate = () => {
  if (repository.value) {
    // router.push({ name: 'CreateTemplate', query: { repositoryId: repository.value.id } });
  }
};

const handleViewTemplate = (promptId: string) => {
  if (repository.value) {
    // router.push({ name: 'TemplateDetails', params: { repositoryId: repository.value.id, templateId: templateId } });
  }
};

const handleEditTemplate = (promptId: string) => {
  if (repository.value) {
    // router.push({ name: 'EditTemplate', params: { repositoryId: repository.value.id, templateId: templateId } });
  }
};

const handleRunTest = (promptId: string) => {
  console.log(`Running test for prompt ${promptId} in repository ${repository.value?.id}`);
  // Navigate to a testing page or trigger a modal
  // router.push({ name: 'TemplateTestRunner', params: { repositoryId: repository.value?.id, templateId } });
  alert(`Simulating test run for Prompt ID: ${promptId}`);
};

const handleDeleteTemplate = async (promptId: string) => {
  if (!repository.value) return;
  // const templateName = repository.value.prompts.find(t => t.id === promptId)?.name || 'this template';

  // if (confirm(`Are you sure you want to delete ${templateName}? This action cannot be undone.`)) {
  //   console.log(`Deleting template ${promptId} from repository ${repository.value.id}`);
  //   // In a real app: make API call to delete template
  //   // await api.deleteTemplate(repository.value.id, templateId);

  //   // Update local state (optional, or re-fetch data)
  //   repository.value.templates = repository.value.templates.filter(t => t.id !== promptId);
  //   repository.value.templateCount = repository.value.templates.length;
  //   alert(`${templateName} deleted successfully.`);
  // }
};
</script>

<template>
  <ListDetails
    :createButtonName="'Add New Template'"
    :deleteButtonName="'Delete Repository'"
    :editButtonName="'Edit Repository'"
    :isLoading="isLoading"
    :loadingDescription="'Loading repository details...'"
    :listDetailsId="repository?.id || ''"
    :listDetailsName="repository?.name || ''"
    :listDetailsDescription="repository?.description || ''"
    :listDetailsInfo="[
      {
        icon: ClockIcon,
        text: `Created: ${format(repository?.createdAt || new Date(), 'MMM d, yyyy')}`
      },
      {
        icon: ArrowPathIcon,
        text: `Last Modified: ${formatDistanceToNow(repository?.updatedAt || new Date())} ago`
      },
      {
        icon: DocumentDuplicateIcon,
        text: `Templates: ${promptCount}`
      }
    ]"
    :listDetailsTags="repository?.tags || []"
    :items="prompts || []"
    :itemsName="'prompt templates'"
    :itemsTitle="`Templates in this Repository (${promptCount})`"
    :itemFoundDescription="'Prompt Template Not Found'"
    @editDetails="handleEditRepository"
  />
</template>