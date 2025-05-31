<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowPathIcon } from '@heroicons/vue/20/solid'; // For loading spinner
import FormContainer from '@/components/base/form/FormContainer.vue'


// Define a type for the form data
interface CollectionForm {
  name: string;
  description: string;
  tagsInput: string; // Store as a single string for input, then parse to array
  permission: 'private' | 'team' | 'public';
}

interface FormErrors {
  name?: string;
}

const router = useRouter();

// Form state
const collectionForm = reactive<CollectionForm>({
  name: '',
  description: '',
  tagsInput: '',
  permission: 'private', // Default permission
});

// Error state for form validation
const errors = reactive<FormErrors>({});

// Loading state for submission
const isSubmitting = ref(false);

// Form submission handler
const handleSubmit = async () => {
  // Reset errors
  errors.name = undefined;

  // Basic validation
  if (!collectionForm.name.trim()) {
    errors.name = 'Collection name is required.';
    return;
  }

  isSubmitting.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Parse tags from string to array
    const tagsArray = collectionForm.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const newCollectionData = {
      id: `coll-${Date.now()}`, // Simple ID for demo
      name: collectionForm.name,
      description: collectionForm.description,
      tags: tagsArray,
      permission: collectionForm.permission,
      createdAt: new Date(),
      lastModified: new Date(),
      templateCount: 0,
      // You might add createdBy: currentUserId, etc.
    };

    console.log('New Collection Data:', newCollectionData);

    // In a real application, send newCollectionData to your backend API
    // const response = await api.createCollection(newCollectionData);

    // After successful creation, redirect to the new collection's detail page
    // or back to the overview page.
    router.push({ name: 'CollectionDetails', params: { id: newCollectionData.id } });
    // Or to overview: router.push({ name: 'TemplateCollectionOverview' });

  } catch (error) {
    console.error('Error creating collection:', error);
    // Display error message to user
    alert('Failed to create collection. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
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
        <div class="mb-5">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Collection Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            v-model="collectionForm.name"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., General Purpose Prompts"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <div class="mb-5">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            v-model="collectionForm.description"
            rows="4"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="A brief explanation of this collection's purpose and content."
          ></textarea>
        </div>

        <div class="mb-5">
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
            Categories/Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            v-model="collectionForm.tagsInput"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., general, utility, marketing"
          />
          <p class="mt-1 text-sm text-gray-500">Separate tags with commas.</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Access Permissions
          </label>
          <div class="mt-2 space-y-3">
            <div class="flex items-center">
              <input
                id="permission-private"
                name="permission-type"
                type="radio"
                v-model="collectionForm.permission"
                value="private"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label for="permission-private" class="ml-3 block text-sm text-gray-900">
                Private (Only you can view and edit)
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="permission-team"
                name="permission-type"
                type="radio"
                v-model="collectionForm.permission"
                value="team"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label for="permission-team" class="ml-3 block text-sm text-gray-900">
                Team (All team members can view and edit)
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="permission-public"
                name="permission-type"
                type="radio"
                v-model="collectionForm.permission"
                value="public"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label for="permission-public" class="ml-3 block text-sm text-gray-900">
                Public (Anyone with the link can view)
              </label>
            </div>
          </div>
        </div>

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