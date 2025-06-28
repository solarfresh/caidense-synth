<script setup lang="ts">
import { apiService } from '@/api/apiService';
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import Container from '@/components/shared/Container.vue';
import { useRepositoryStore } from '@/stores/repository';
import { FormErrors, FormInstance } from '@/types/form';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const store = useRepositoryStore();
// Loading state for submission
const errors = reactive<FormErrors>({});
const isSubmitting = ref(false);
const repositoryForm = reactive<Map<string, FormInstance>>(new Map())
// Form submission handler
const handleSubmit = async () => {
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
      promptTextIds: [],
      tags: tagsArray || []
    }

    const response = await apiService.repository.create(newRepositoryData);
    store.repositories.set(response.data.id, response.data);

  //   // After successful creation, redirect to the new collection's detail page
  //   // or back to the overview page.
    router.push({ name: 'RepositoryDetails', params: { id: response.data.id } });
  //   // Or to overview: router.push({ name: 'TemplateCollectionOverview' });

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
  <Container :page-title="'Create New Repository'">
    <template #content>
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-xl p-8">
        <FormInput :isRequired="true" :labelId="'name'" :labelName="'Repository Name'" :placeholder="'e.g., General Purpose Prompts'" :type="'text'" :ref="el => registerRef('name', el)" />
        <FormTextarea :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'A brief explanation of this collection\'s purpose and content.'" :ref="el => registerRef('description', el)" />
        <FormInput :description="'Separate tags with commas.'" :isRequired="false" :labelId="'tags'" :labelName="'Categories/Tags (comma-separated)'" :placeholder="'e.g., general, utility, marketing'" :type="'text'" :ref="el => registerRef('tags', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Create Repository'" :dynamic-button-name="'Creating...'" />
        </div>
      </form>
    </template>
  </Container>
</template>