<script setup lang="ts">
import { apiService } from '@/api/apiService';
import FormCancelButton from '@/components/layouts/form/FormCancelButton.vue';
import FormContainer from '@/components/layouts/form/FormContainer.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSubmitButton from '@/components/layouts/form/FormSubmitButton.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { FormErrors, FormInstance } from '@/types/form';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
// Loading state for submission
const errors = ref<FormErrors>({name: undefined});
const isSubmitting = ref(false);
const repositoryForm = ref<Map<string, FormInstance>>(new Map())
// Form submission handler
const handleSubmit = async () => {
  // Reset errors
  errors.value.name = undefined;

  // Basic validation
  const repositoryName = repositoryForm.value.get('name')?.editableContent.trim();
  if (!repositoryName) {
    errors.value.name = 'Repository name is required.';
    return;
  }

  isSubmitting.value = true;
  try {
    // Parse tags from string to array
    const tagsArray = repositoryForm.value.get('tags')?.editableContent
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const newRepositoryData = {
      name: repositoryName,
      description: repositoryForm.value.get('description')?.editableContent || '',
      prompts: [],
      tags: tagsArray || []
    }

    const response = await apiService.repository.create(newRepositoryData);

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
    repositoryForm.value.set(key, instance)
  }
}
</script>

<template>
  <FormContainer :title="'Create New Repository'">
    <template #page>
      <form @submit.prevent="handleSubmit">
        <FormInput :isRequired="true" :labelId="'name'" :labelName="'Repository Name'" :placeholder="'e.g., General Purpose Prompts'" :type="'text'" :ref="el => registerRef('name', el)" />
        <FormTextarea :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'A brief explanation of this collection\'s purpose and content.'" :ref="el => registerRef('description', el)" />
        <FormInput :description="'Separate tags with commas.'" :isRequired="false" :labelId="'tags'" :labelName="'Categories/Tags (comma-separated)'" :placeholder="'e.g., general, utility, marketing'" :type="'text'" :ref="el => registerRef('tags', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <FormCancelButton />
          <FormSubmitButton :isSubmitting="isSubmitting" :buttonName="'Create Repository'" :dynamic-button-name="'Creating...'" />
        </div>
      </form>
    </template>
  </FormContainer>
</template>