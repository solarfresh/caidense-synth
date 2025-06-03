<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/20/solid'; // Using /20/solid for smaller icons
import FormContainer from '@/components/layouts/form/FormContainer.vue';
import FormSection from '@/components/layouts/form/FormSection.vue';
import CreateButton from '@/components/base/buttons/CreateButton.vue'
import CreatePromptVariableSection from './CreatePromptVariableSection.vue';
import type { Variable } from '@/types/common';


interface TemplateForm {
  name: string;
  collectionId: string;
  description: string;
  content: string;
  parameters: Variable[];
}

interface FormErrors {
  name?: string;
  collectionId?: string;
  content?: string;
  [key: string]: string | undefined; // For dynamic parameter errors
}

interface CollectionOption { // For the dropdown list of collections
  id: string;
  name: string;
}

// --- State Management ---
const router = useRouter();
const route = useRoute(); // To get collectionId from query params

const templateForm = reactive<TemplateForm>({
  name: '',
  collectionId: '', // Default to empty, require user selection
  description: '',
  content: '',
  parameters: [],
});

const errors = reactive<FormErrors>({});
const isSubmitting = ref(false);
const availableCollections = ref<CollectionOption[]>([]); // For the dropdown

// --- Lifecycle Hooks ---
onMounted(async () => {
  // Pre-select collection if passed via query parameter (e.g., from Collection Details page)
  const collectionIdFromRoute = route.query.collectionId as string;
  if (collectionIdFromRoute) {
    templateForm.collectionId = collectionIdFromRoute;
  }

  // Fetch available collections for the dropdown
  await fetchAvailableCollections();
});

// --- Data Fetching (Mock) ---
async function fetchAvailableCollections() {
  // Simulate API call to get user's collections
  await new Promise(resolve => setTimeout(resolve, 500));
  availableCollections.value = [
    { id: 'coll-001', name: 'General Purpose Prompts' },
    { id: 'coll-002', name: 'Customer Service Bot Prompts' },
    { id: 'coll-003', name: 'Content Generation Prompts' },
  ];
}

// --- Parameter Management Logic ---
const extractParameters = () => {
  const content = templateForm.content;
  const regex = /\[([A-Z0-9_]+)\]/g; // Matches [PARAM_NAME]
  let match;
  const extractedNames = new Set<string>();

  while ((match = regex.exec(content)) !== null) {
    const paramName = match[1];
    extractedNames.add(paramName);
  }

  // Remove parameters that are no longer in the content
  templateForm.parameters = templateForm.parameters.filter(param =>
    extractedNames.has(param.name) || !param.name // Keep manually added empty ones
  );

  // Add new parameters found in content
  extractedNames.forEach(name => {
    if (!templateForm.parameters.some(p => p.name === name)) {
      templateForm.parameters.push({
        id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // Temp ID
        name: name,
        type: 'text', // Default type
        description: '',
      });
    }
  });

  // Sort parameters by name for consistency
  templateForm.parameters.sort((a, b) => a.name.localeCompare(b.name));
};

const addParameter = () => {
  templateForm.parameters.push({
    id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: '',
    type: 'text',
    description: '',
  });
};

const removeParameter = (index: number) => {
  templateForm.parameters.splice(index, 1);
};

// --- Form Submission & Validation ---
const validateForm = () => {
  let isValid = true;
  // Clear previous errors
  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      delete errors[key];
    }
  }

  if (!templateForm.name.trim()) {
    errors.name = 'Template name is required.';
    isValid = false;
  }
  if (!templateForm.collectionId) {
    errors.collectionId = 'A collection must be selected.';
    isValid = false;
  }
  if (!templateForm.content.trim()) {
    errors.content = 'Prompt text is required.';
    isValid = false;
  }

  // Validate parameters
  templateForm.parameters.forEach((param, index) => {
    if (!param.name.trim()) {
      errors[`param-${index}-name`] = 'Parameter name is required.';
      isValid = false;
    }
    // Check for duplicate parameter names
    const duplicateCount = templateForm.parameters.filter(p => p.name === param.name && p.name.trim() !== '').length;
    if (duplicateCount > 1) {
      errors[`param-${index}-name`] = 'Duplicate parameter name.';
      isValid = false;
    }
    if (param.type === 'enum' && (!param.enumOptionsInput || !param.enumOptionsInput.trim())) {
        errors[`param-${index}-enumOptions`] = 'Enum options are required for dropdown type.';
        isValid = false;
    }
  });

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    // Scroll to the first error if any
    const firstErrorField = document.querySelector('.text-red-600');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  isSubmitting.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Prepare data for API
    const parametersForApi = templateForm.parameters.map(param => ({
      name: param.name,
      type: param.type,
      description: param.description,
      enumOptions: param.type === 'enum' && param.enumOptionsInput
        ? param.enumOptionsInput.split(',').map(opt => opt.trim()).filter(opt => opt !== '')
        : undefined,
    }));

    const newTemplateData = {
      id: `temp-${Date.now()}`, // Generate a simple ID for demo
      name: templateForm.name,
      collectionId: templateForm.collectionId,
      description: templateForm.description,
      content: templateForm.content,
      parameters: parametersForApi,
      createdAt: new Date(),
      lastModified: new Date(),
      // Add other relevant fields like createdBy
    };

    console.log('New Template Data:', newTemplateData);

    // In a real application, send newTemplateData to your backend API
    // const response = await api.createTemplate(newTemplateData);

    alert('Template created successfully!');
    router.push({ name: 'TemplateDetails', params: { collectionId: templateForm.collectionId, templateId: newTemplateData.id } });

  } catch (error) {
    console.error('Error creating template:', error);
    alert('Failed to create template. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.back(); // Go back to previous page
};
</script>

<template>
  <FormContainer :title="'Create New Prompt Template'">
    <template #page>
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-xl p-8">
        <FormSection :title="'Basic Information'">
          <template #fields>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="templateName" class="block text-sm font-medium text-gray-700 mb-1">
                  Template Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="templateName"
                  v-model="templateForm.name"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Summarize Article, Generate Marketing Copy"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <div>
                <label for="collection" class="block text-sm font-medium text-gray-700 mb-1">
                  Belongs to Collection <span class="text-red-500">*</span>
                </label>
                <select
                  id="collection"
                  v-model="templateForm.collectionId"
                  required
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>Select a collection</option>
                  <option v-for="col in availableCollections" :key="col.id" :value="col.id">
                    {{ col.name }}
                  </option>
                </select>
                <p v-if="errors.collectionId" class="mt-1 text-sm text-red-600">{{ errors.collectionId }}</p>
              </div>
            </div>

            <div class="mt-6">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="templateForm.description"
                rows="3"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="A brief explanation of this template's purpose."
              ></textarea>
            </div>
          </template>
        </FormSection>
        <FormSection :title="'Template Content'">
          <template #fields>
            <label for="templateContent" class="block text-sm font-medium text-gray-700 mb-1">
              Prompt Text <span class="text-red-500">*</span>
            </label>
            <textarea
              id="templateContent"
              v-model="templateForm.content"
              rows="10"
              required
              class="font-mono text-sm block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Summarize the following text in [TONE] tone: [TEXT]"
              @input="extractParameters"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              Use `[PARAM_NAME]` to define parameters that will be replaced with dynamic data.
            </p>
            <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
          </template>
        </FormSection>

        <CreatePromptVariableSection :variables="templateForm.parameters" />

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
            {{ isSubmitting ? 'Creating...' : 'Create Template' }}
          </button>
        </div>
      </form>
    </template>
  </FormContainer>
</template>