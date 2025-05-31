<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid';

// Define types (re-use from CreateCollection or a shared types file)
interface CollectionForm {
  name: string;
  description: string;
  tagsInput: string;
  permission: 'private' | 'team' | 'public';
}

interface FormErrors {
  name?: string;
}

interface TemplateCollectionData { // This represents the data fetched from backend
  id: string;
  name: string;
  description: string;
  tags: string[];
  permission: 'private' | 'team' | 'public';
  // Other fields like createdAt, lastModified, templateCount
}

const route = useRoute();
const router = useRouter();

// Form state
const collectionForm = reactive<CollectionForm>({
  name: '',
  description: '',
  tagsInput: '',
  permission: 'private',
});

// Loading and error states
const isLoading = ref(true);
const collectionFound = ref(true); // To indicate if the collection exists
const isSubmitting = ref(false);
const errors = reactive<FormErrors>({});

// Fetch collection data on component mount
onMounted(async () => {
  const collectionId = route.params.id as string;
  if (!collectionId) {
    collectionFound.value = false;
    isLoading.value = false;
    return;
  }

  try {
    // Simulate API call to fetch existing collection data
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock data based on the ID (replace with actual API fetch)
    const fetchedCollection: TemplateCollectionData | undefined = mockCollections.find(
      (c) => c.id === collectionId
    );

    if (fetchedCollection) {
      collectionForm.name = fetchedCollection.name;
      collectionForm.description = fetchedCollection.description;
      collectionForm.tagsInput = fetchedCollection.tags.join(', '); // Join tags for input
      collectionForm.permission = fetchedCollection.permission;
      collectionFound.value = true;
    } else {
      collectionFound.value = false;
    }
  } catch (error) {
    console.error('Error fetching collection:', error);
    collectionFound.value = false; // Assume not found on error
    alert('Failed to load collection data.');
  } finally {
    isLoading.value = false;
  }
});

// Form submission handler
const handleSubmit = async () => {
  errors.name = undefined;

  if (!collectionForm.name.trim()) {
    errors.name = 'Collection name is required.';
    return;
  }

  isSubmitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tagsArray = collectionForm.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const updatedCollectionData = {
      id: route.params.id as string,
      name: collectionForm.name,
      description: collectionForm.description,
      tags: tagsArray,
      permission: collectionForm.permission,
      lastModified: new Date(), // Update last modified timestamp
    };

    console.log('Updated Collection Data:', updatedCollectionData);

    // In a real application, send updatedCollectionData to your backend API
    // const response = await api.updateCollection(updatedCollectionData.id, updatedCollectionData);

    router.push({ name: 'CollectionDetails', params: { id: updatedCollectionData.id } });
  } catch (error) {
    console.error('Error updating collection:', error);
    alert('Failed to update collection. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel handler
const handleCancel = () => {
  router.back();
};

// --- Mock Data (for demonstration) ---
const mockCollections: TemplateCollectionData[] = [
  {
    id: 'coll-001',
    name: 'General Purpose Prompts',
    description: 'A collection of versatile prompts for various AI tasks.',
    tags: ['general', 'utility'],
    permission: 'team',
  },
  {
    id: 'coll-002',
    name: 'Customer Service Bot Prompts',
    description: 'Prompts for AI-powered customer service agents.',
    tags: ['customer service', 'chatbot'],
    permission: 'private',
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Edit Template Collection: <span class="text-indigo-600">{{ collectionForm.name }}</span>
      </h1>

      <div v-if="isLoading" class="text-center py-10 text-gray-600">
        <ArrowPathIcon class="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-2" />
        <p>Loading collection details...</p>
      </div>

      <div v-else-if="!collectionFound" class="text-center py-10 text-red-600">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p>Collection not found!</p>
        <button @click="router.back()" class="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>

      <form v-else @submit.prevent="handleSubmit">
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
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>