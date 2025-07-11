<script setup lang="ts">
import { apiService } from '@/api/apiService';
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormMultiFields from '@/components/layouts/form/FormMultiFields.vue';
import FormSection from '@/components/layouts/form/FormSection.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import Container from '@/components/shared/Container.vue';
import { usePromptStore } from '@/stores/prompt';
import { useRepositoryStore } from '@/stores/repository';
import type { CreateVariable, DocumentStatus } from '@/types/common';
import type { FormErrors, FormInstance, FormSelectOption } from '@/types/form';
import type { CreatePrompt } from '@/types/prompts';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import PromptVariableEditSection from './PromptVariableEditSection.vue';


const router = useRouter();
const store = {
  repository: useRepositoryStore(),
  prompt: usePromptStore(),
};
const templateForm = reactive<Map<string, FormInstance>>(new Map());
const editableVariables = ref<CreateVariable[]>([]);
const errors = reactive<FormErrors>({});
const isSubmitting = ref(false);
const availableRepositories = ref<FormSelectOption[]>([]); // For the dropdown

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchAvailableRepositories();
});

async function fetchAvailableRepositories() {
  const response = await apiService.repository.getAll();
  availableRepositories.value = response.data.map(repository => {
    return {id: repository.id, name: repository.name}
  });
}

const extractVariables = () => {
  const content = templateForm.get('templateContent')?.editableContent || '';
  const regex = /\{([A-Z0-9_]+)\}/g; // Matches [PARAM_NAME]
  let match;
  const extractedNames = new Set<string>();

  while ((match = regex.exec(content)) !== null) {
    const variableName = match[1];
    extractedNames.add(variableName);
  }

  // Remove variables that are no longer in the content
  const existEditableVatiables: CreateVariable[] = templateForm.get('variables')?.editableVariables || [];
  editableVariables.value = existEditableVatiables.filter(variable =>
    extractedNames.has(variable.name) || !variable.name // Keep manually added empty ones
  );

  // Add new parameters found in content
  extractedNames.forEach(name => {
    if (!editableVariables.value.some(variable => variable.name === name)) {
      editableVariables.value.push({
        name: name,
        type: 'text', // Default type
        description: '',
      });
    }
  });

  // Sort parameters by name for consistency
  editableVariables.value.sort((a, b) => a.name.localeCompare(b.name));
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

  const name = templateForm.get('multiFields')?.formInstance?.get('templateName')?.editableContent;
  if (!name || !name.trim()) {
    errors.name = 'Template name is required.';
    isValid = false;
    return isValid;
  }

  if (!templateForm.get('multiFields')?.formInstance?.get('repositoryName')?.editableContent) {
    errors.name = 'A repository must be selected.';
    isValid = false;
    return isValid;
  }

  const content = templateForm.get('templateContent')?.editableContent;
  if (!content || !content.trim()) {
    errors.name = 'Prompt text is required.';
    isValid = false;
    return isValid;
  }

  // Validate variables
  const variables = templateForm.get('variables')?.editableVariables || []
  variables.forEach((variable, index) => {
    if (!variable.name.trim()) {
      errors[`param-${index}-name`] = 'Parameter name is required.';
      console.log(errors[`param-${index}-name`]);
      isValid = false;
    }
    // Check for duplicate variable names
    const duplicateCount = variables.filter(v => v.name === variable.name && v.name.trim() !== '').length;
    if (duplicateCount > 1) {
      errors[`param-${index}-name`] = 'Duplicate parameter name.';
      isValid = false;
    }
    if (variable.type === 'enum' && (!variable.enumOptionsInput || !variable.enumOptionsInput.trim())) {
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
    const variablesData: CreateVariable[] = templateForm.get('variables')?.editableVariables?.map(variable => ({
      name: variable.name,
      type: variable.type,
      description: variable.description,
      required: variable.required,
      enumOptions: variable.type === 'enum' && variable.enumOptionsInput
        ? variable.enumOptionsInput.split(',').map(opt => opt.trim()).filter(opt => opt !== '')
        : undefined,
    })) || [];

    const newTemplateData: CreatePrompt = {
      name: templateForm.get('multiFields')?.formInstance?.get('templateName')?.editableContent || '',
      promptSetId: templateForm.get('multiFields')?.formInstance?.get('repositoryName')?.editableContent || '',
      description: templateForm.get('description')?.editableContent || '',
      promptText: templateForm.get('templateContent')?.editableContent || '',
      variables: variablesData,
      status: 'draft' as DocumentStatus,
      // Add other relevant fields like createdBy
    };

    const promptResponse = await apiService.prompt.create(newTemplateData);
    const repositoryResponse = await apiService.repository.get(promptResponse.data.promptSetId);
    const promptTextIds = new Set(repositoryResponse.data.promptTextIds);
    promptTextIds.add(promptResponse.data.id);
    const updatedRepositoryResponse = await apiService.repository.update(repositoryResponse.data.id, {promptTextIds: Array.from(promptTextIds)});
    store.prompt.prompts.set(promptResponse.data.id, promptResponse.data);
    store.repository.repositories.set(updatedRepositoryResponse.data.id, updatedRepositoryResponse.data);
    // In a real application, send newTemplateData to your backend API
    // const response = await api.createTemplate(newTemplateData);
    router.push({ name: 'PromptDetail', params: { id: promptResponse.data.id } });

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
  <Container :page-title="'Create New Prompt Template'">
    <template #content>
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
                  content: store.repository.currentRepositoryId || '',
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
            <FormTextarea :isRequired="true" :labelId="'templateContent'" :labelName="'Prompt Text'" :description="'Use `{VARIABLE_NAME}` to define variables that will be replaced with dynamic data.'" :placeholder="'e.g., Summarize the following text in {TONE} tone: {TEXT}'" @input="extractVariables" :ref="el => registerRef('templateContent', el)" />
          </template>
        </FormSection>

        <PromptVariableEditSection :variables="editableVariables" :ref="el => registerRef('variables', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Create Template'" :dynamic-button-name="'Creating...'" />
        </div>
      </form>
    </template>
  </Container>
</template>