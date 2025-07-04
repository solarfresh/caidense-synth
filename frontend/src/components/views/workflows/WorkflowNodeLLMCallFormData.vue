<script setup lang="ts">
import { apiService } from '@/api/apiService';
import FormCheckbox from '@/components/layouts/form/FormCheckbox.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import { useRepositoryStore } from '@/stores/repository';
import type { FormInstance, FormSelectOption } from '@/types/form';
import { Node, useVueFlow } from '@vue-flow/core';
import { PropType, onMounted, reactive, ref, watch } from 'vue';


const flowStore = useVueFlow();
const store = useRepositoryStore();

const props = defineProps({
  nodeConfig: {
    type: Object as PropType<Node | null>,
    required: true
  }
});

const promptTemplate = ref('');
const repositoryId = ref('');
const repositoryOptions = ref<FormSelectOption[]>([]);
const promptId = ref('');
const promptOptions = ref<FormSelectOption[]>([]);
const isInference = ref('');
const formInstance = reactive<Map<string, FormInstance>>(new Map());

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}

watch(() => props.nodeConfig?.data.config, (newConfig) => {
  promptTemplate.value = newConfig.promptTemplate;
  isInference.value = newConfig.isInference;
});

onMounted(() => {
  promptTemplate.value = props.nodeConfig?.data.config.promptTemplate;
  isInference.value = props.nodeConfig?.data.config.isInference;
  fetchRepositories();
  fetchPrompts();
});

const fetchPrompts = async () => {
  if (!store.prompts.size) {
    const response = await apiService.prompt.getAll();
    store.updateAllPrompts(response.data);
  }
};

const fetchRepositories = async () => {
  if (!store.repositories.size) {
    const response = await apiService.repository.getAll();
    store.updateState({
      repositories: new Map(response.data.map(repository => {
        return [repository.id, repository]
      }))
    })
  }

  repositoryOptions.value = [...store.repositories].map(([repositoryId, repository]) => {
    return {
      id: repositoryId,
      name: repository.name
    }
  });
};

const handleSelectRepository = (newRepositoryId: string) => {
  promptOptions.value = store.prompts.get(newRepositoryId)?.map((prompt) => {
    return {
      id: prompt.id,
      name: prompt.name
    }
  }) || [];
  repositoryId.value = newRepositoryId;
};

const handleSelectPrompt = (newPromptId: string) => {
  promptId.value = newPromptId;
  promptTemplate.value = store.prompts.get(repositoryId.value)?.find(prompt => prompt.id === promptId.value)?.promptText || '';
};

const parsePromptContent = () => {
  const content: string = promptTemplate.value;

  const parts = [];
  const regex = /(\{[A-Z0-9_]+\})/g; // Matches {PARAM_NAME}
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the parameter
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    // Add the parameter itself
    parts.push({ type: 'param', value: match[1].slice(1, -1) }); // Remove [] for display
    lastIndex = regex.lastIndex;
  }
  // Add any remaining text after the last parameter
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.substring(lastIndex) });
  }
  return parts;
};

defineExpose({
  formInstance
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
    <FormSelect @change="handleSelectRepository" :labelId="'selectRepository'" :labelName="'Repository'" :options="repositoryOptions" :ref="el => registerRef('selectRepository', el)" />
    <FormSelect @change="handleSelectPrompt" :labelId="'selectPromptTemplate'" :labelName="'Prompt Template'" :options="promptOptions" :ref="el => registerRef('selectPromptTemplate', el)" />
    <FormCheckbox :label-id="'isInference'" :label-name="'Inference?'" :ref="el => registerRef('isInference', el)" />
  </div>

  <div v-if="promptTemplate" class="bg-gray-50 font-mono p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200 h-64 overflow-y-auto">
    <span v-for="(part, index) in parsePromptContent()" :key="index">
      <span v-if="part.type === 'text'">{{ part.value }}</span>
      <span v-else class="text-indigo-600 font-semibold bg-indigo-100 px-1 py-0.5 rounded-sm">{{ `\{${part.value}\}` }}</span>
    </span>
  </div>

</template>