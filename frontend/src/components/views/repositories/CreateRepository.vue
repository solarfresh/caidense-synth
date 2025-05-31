<script setup lang="ts">
import FormContainer from '@/components/base/form/FormContainer.vue';
import FormInput from '@/components/base/form/FormInput.vue';
import FormTextarea from '@/components/base/form/FormTextarea.vue';
import { ArrowPathIcon } from '@heroicons/vue/20/solid'; // For loading spinner
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
// Loading state for submission
const isSubmitting = ref(false);
// Form submission handler
const handleSubmit = async () => {
  // // Reset errors
  // errors.name = undefined;

  // // Basic validation
  // if (!collectionForm.name.trim()) {
  //   errors.name = 'Collection name is required.';
  //   return;
  // }

  // isSubmitting.value = true;
  // try {
  //   // Simulate API call
  //   await new Promise(resolve => setTimeout(resolve, 1500));

  //   // Parse tags from string to array
  //   const tagsArray = collectionForm.tagsInput
  //     .split(',')
  //     .map(tag => tag.trim())
  //     .filter(tag => tag !== '');

  //   const newCollectionData = {
  //     id: `coll-${Date.now()}`, // Simple ID for demo
  //     name: collectionForm.name,
  //     description: collectionForm.description,
  //     tags: tagsArray,
  //     permission: collectionForm.permission,
  //     createdAt: new Date(),
  //     lastModified: new Date(),
  //     templateCount: 0,
  //     // You might add createdBy: currentUserId, etc.
  //   };

  //   console.log('New Collection Data:', newCollectionData);

  //   // In a real application, send newCollectionData to your backend API
  //   // const response = await api.createCollection(newCollectionData);

  //   // After successful creation, redirect to the new collection's detail page
  //   // or back to the overview page.
  //   router.push({ name: 'CollectionDetails', params: { id: newCollectionData.id } });
  //   // Or to overview: router.push({ name: 'TemplateCollectionOverview' });

  // } catch (error) {
  //   console.error('Error creating collection:', error);
  //   // Display error message to user
  //   alert('Failed to create collection. Please try again.');
  // } finally {
  //   isSubmitting.value = false;
  // }
};

// Cancel handler
const handleCancel = () => {
  router.back(); // Go back to the previous page
};
</script>

<template>
  <FormContainer :title="'Create New Repository'">
    <template #form>
      <form @submit.prevent="handleSubmit">
        <FormInput :isRequired="true" :labelId="'name'" :labelName="'Repository Name'" :placeholder="'e.g., General Purpose Prompts'" :type="'text'" />
        <FormTextarea :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'A brief explanation of this collection\'s purpose and content.'" />
        <FormInput :description="'Separate tags with commas.'" :isRequired="false" :labelId="'tags'" :labelName="'Categories/Tags (comma-separated)'" :placeholder="'e.g., general, utility, marketing'" :type="'text'" />

        <div class="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon v-if="isSubmitting" class="-ml-1 mr-2 h-4 w-4 animate-spin" />
            {{ isSubmitting ? 'Creating...' : 'Create Collection' }}
          </button>
        </div>
      </form>
    </template>
  </FormContainer>
</template>