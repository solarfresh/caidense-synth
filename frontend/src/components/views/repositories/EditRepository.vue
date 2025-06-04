<script setup lang="ts">
import { apiService } from '@/api/apiService';
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormContainer from '@/components/layouts/form/FormContainer.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { useRepositoryStore } from '@/stores/repository';
import { FormErrors, FormInstance } from '@/types/form';
import { Repository } from '@/types/repositories';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();
const store = useRepositoryStore();

// Loading and error states
const errors = reactive<FormErrors>({});
const isLoading = ref(true);
const isSubmitting = ref(false);
const repositoryData = ref<Repository | null>(null);
const repositoryFound = ref(true); // To indicate if the collection exists
const repositoryForm = reactive<Map<string, FormInstance>>(new Map())

// Fetch collection data on component mount
onMounted(async () => {
  const repositoryId = route.params.id as string;
  if (!repositoryId) {
    repositoryFound.value = false;
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await apiService.repository.get(repositoryId)
    if (response.data) {
      repositoryData.value = response.data
      repositoryFound.value = true;
    }
  } catch (error) {
    console.error('Error fetching repository:', error);
    repositoryFound.value = false; // Assume not found on error
    alert('Failed to load repository data.');
  } finally {
    isLoading.value = false;
  }
});
// Form submission handler
const handleSubmit = async () => {
  const repositoryId = route.params.id as string;
  // Reset errors
  errors.name = undefined;

  // Basic validation
  const repositoryName = repositoryForm.get('name')?.editableContent?.trim();
  if (!repositoryName) {
    errors.name = 'Repository name is required.';
    return;
  }

  isSubmitting.value = true;
  try {
    // Parse tags from string to array
    const tagsArray = repositoryForm.get('tags')?.editableContent
      ?.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const newRepositoryData = {
      name: repositoryName,
      description: repositoryForm.get('description')?.editableContent || '',
      tags: tagsArray || []
    }

    const response = await apiService.repository.update(repositoryId, newRepositoryData);
    store.repositories.set(response.data.id, response.data);
    router.push({ name: 'RepositoryOverview' });

  } catch (error) {
    console.error('Error creating repository:', error);
    // Display error message to user
    alert('Failed to create repository. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
const registerRef = async (key:string, instance: any) => {
  if (instance) {
    repositoryForm.set(key, instance)
  }
}
</script>

<template>
  <FormContainer :title="'Edit Repository'" :enhanced-title="repositoryData?.name || ''" :is-loading="isLoading" :loading-description="'Loading repository details...'" :item-found="repositoryFound" :item-found-description="'Repository not found!'">
    <template #page>
      <form @submit.prevent="handleSubmit">
        <FormInput :content="repositoryData?.name || ''" :isRequired="true" :labelId="'name'" :labelName="'Repository Name'" :placeholder="'e.g., General Purpose Prompts'" :type="'text'" :ref="el => registerRef('name', el)" />
        <FormTextarea :content="repositoryData?.description || ''" :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'A brief explanation of this collection\'s purpose and content.'" :ref="el => registerRef('description', el)" />
        <FormInput :content="repositoryData?.tags.join(', ') || ''" :description="'Separate tags with commas.'" :isRequired="false" :labelId="'tags'" :labelName="'Categories/Tags (comma-separated)'" :placeholder="'e.g., general, utility, marketing'" :type="'text'" :ref="el => registerRef('tags', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Save Changes'" :dynamic-button-name="'Saving...'" />
        </div>
      </form>
    </template>
  </FormContainer>
</template>