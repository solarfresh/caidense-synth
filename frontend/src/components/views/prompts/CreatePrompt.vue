<script setup lang="ts">
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormContainer from '@/components/layouts/form/FormContainer.vue';
import FormMultiFields from '@/components/layouts/form/FormMultiFields.vue';
import FormSection from '@/components/layouts/form/FormSection.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import type { Variable } from '@/types/common';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CreatePromptVariableSection from './CreatePromptVariableSection.vue';
import { FormErrors, FormInstance, FormSelectOption } from '@/types/form';
import { apiService } from '@/api/apiService';
import RepositoryCard from '../repositories/RepositoryCard.vue';


interface TemplateForm {
  name: string;
  collectionId: string;
  description: string;
  content: string;
  parameters: Variable[];
}

interface CollectionOption { // For the dropdown list of collections
  id: string;
  name: string;
}

// --- State Management ---
const router = useRouter();

const templateForm = reactive<Map<string, FormInstance>>(new Map())
const errors = reactive<FormErrors>({});
const isSubmitting = ref(false);
const availableRepositories = ref<FormSelectOption[]>([]); // For the dropdown

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchAvailableCollections();
});

async function fetchAvailableCollections() {
  const response = await apiService.repository.getAll();
  availableRepositories.value = response.data.map(repository => {
    return {id: repository.id, name: repository.name}
  });
}

// --- Parameter Management Logic ---
const extractParameters = () => {
  const content = templateForm.content;
  const regex = /\{([A-Z0-9_]+)\}/g; // Matches [PARAM_NAME]
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

// --- Form Submission & Validation ---
const validateForm = () => {
  let isValid = true;
  // Clear previous errors
  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      delete errors[key];
    }
  }

  console.log('=============== templateForm ===============')
  console.log(JSON.stringify(Object.fromEntries(templateForm.entries()), null, 2))
  console.log('=============== availableRepositories ===============')
  console.log(JSON.stringify(availableRepositories.value, null, 2))
  console.log('=============== multiFields ===============')
  console.log(JSON.stringify(Object.fromEntries(templateForm.get('multiFields').formInstance.entries()), null, 2))

  if (!templateForm.get('name')?.editableContent.trim()) {
    errors.name = 'Template name is required.';
    isValid = false;
  }
  if (!templateForm.collectionId) {
    errors.collectionId = 'A collection must be selected.';
    isValid = false;
  }
  if (!templateForm.get('content')?.editableContent.trim()) {
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
const registerRef = async (key:string, instance: any) => {
  if (instance) {
    templateForm.set(key, instance)
  }
}
</script>

<template>
  <FormContainer :title="'Create New Prompt Template'">
    <template #page>
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-xl p-8">
        <FormSection :title="'Basic Information'">
          <template #fields>
            <FormMultiFields
              :ref="el => registerRef('multiFields', el)"
              :componentInfo="[
              {
                name: 'input',
                props: {
                  hasMargin: false,
                  labelId: 'templateName',
                  labelName: 'Template Name',
                  isRequired: true,
                  placeholder: 'e.g., Summarize Article, Generate Marketing Copy',
                  type: 'text'
                }
              },
              {
                name: 'select',
                props: {
                  hasMargin: false,
                  labelId: 'repositoryName',
                  labelName: 'Belongs to Repository',
                  isRequired: true,
                  optionName: 'Select a repository',
                  options: availableRepositories
                }
              }
            ]" />
            <FormTextarea :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'A brief explanation of this template\'s purpose.'" :ref="el => registerRef('description', el)" />
          </template>
        </FormSection>
        <FormSection :title="'Template Content'">
          <template #fields>
            <FormTextarea :isRequired="true" :labelId="'templateContent'" :labelName="'Prompt Text'" :description="'Use `{VARIABLE_NAME}` to define variables that will be replaced with dynamic data.'" :placeholder="'e.g., Summarize the following text in {TONE} tone: {TEXT}'" :ref="el => registerRef('templateContent', el)" />
          </template>
        </FormSection>

        <CreatePromptVariableSection :variables="[]" :ref="el => registerRef('variables', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Create Template'" :dynamic-button-name="'Creating...'" />
        </div>
      </form>
    </template>
  </FormContainer>
</template>