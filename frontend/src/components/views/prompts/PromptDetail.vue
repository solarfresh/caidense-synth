<script setup lang="ts">
import { apiService } from '@/api/apiService';
import Details from '@/components/layouts/detail/Details.vue';
import { usePromptStore } from '@/stores/prompt';
import { useRepositoryStore } from '@/stores/repository';
import type { FormInstance } from '@/types/form';
import type { GenAIRequest } from '@/types/genai';
import type { EvaluationMetrics, EvaluationResult, Prompt } from '@/types/prompts';
import type { Repository } from '@/types/repositories';
import {
  ArrowPathIcon, // For empty evaluation state
  ClockIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns';
import MarkdownIt from 'markdown-it';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PromptContentViewSection from './PromptContentViewSection.vue';
import PromptEvaluationSection from './PromptEvaluationSection.vue';
import PromptVariableViewSection from './PromptVariableViewSection.vue';


const store = {
  repository: useRepositoryStore(),
  prompt: usePromptStore(),
};

// --- State Management ---
const route = useRoute();
const router = useRouter();

const availablePrompTemplates = ref();
const prompt = ref<Prompt | null>(null);
const promptVariables = ref<FormInstance | null>(null);
const promptEvaluationTemplate = ref();
const repository = ref<Repository | null>(null);
const isLoading = ref(true);
const isEvaluating = ref(false);
const evaluationResult = ref<EvaluationResult | null>(null);

// For testing inputs
const testInputs = reactive<{ [key: string]: any }>({});

// --- Data Fetching ---
onMounted(async () => {
  const promptId = route.params.id as string;

  if (!promptId) {
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    let response = undefined;

    store.prompt.updateState({currentPromptId: promptId});
    prompt.value = store.prompt.prompts.get(promptId) || null;
    if (prompt.value === null) {
      response = await apiService.prompt.get(promptId);
      prompt.value = response.data;
      store.prompt.prompts.set(promptId, response.data);
    }

    repository.value = store.repository.repositories.get(prompt.value.promptSetId) || null;
    if (repository.value === null) {
      response = await apiService.repository.get(prompt.value.promptSetId);
      repository.value = response.data;
      store.repository.repositories.set(prompt.value.promptSetId, response.data);
    }

    response = await apiService.prompt.getAll({filter: JSON.stringify({promptSetId: prompt.value.promptSetId})});
    availablePrompTemplates.value = response.data.map(prompt => {
      store.prompt.prompts.set(prompt.id, prompt);
      return {id: prompt.id, name: prompt.name}
    });
  } catch (error) {
    console.error('Error fetching template details:', error);
    prompt.value = null; // Mark as not found on error
    alert('Failed to load template details. Please try again.');
  } finally {
    isLoading.value = false;
  }
});

// --- Event Handlers / Actions ---
const handleEditTemplate = () => {
  if (prompt.value) {
    router.push({ name: 'EditPrompt', params: { id: prompt.value.id } });
  }
};

const handleDuplicateTemplate = () => {
  if (prompt.value) {
    // Navigate to CreatePromptTemplate page, pre-filling with current template's data
    // This typically means passing data via route query or a state management store
    // router.push({
    //   name: 'CreatePrompt',
    //   query: {
    //     collectionId: template.value.collectionId,
    //     duplicateFrom: template.value.id, // Indicate it's a duplication
    //   },
    // });
  }
};

const handleDeleteTemplate = async () => {
  if (!prompt.value) return;

  if (confirm(`Are you sure you want to delete the template "${prompt.value.name}"? This action cannot be undone.`)) {
    console.log('Deleting template:', prompt.value.id);
    // In a real app: make API call to delete template
    // await api.deleteTemplate(template.value.collectionId, template.value.id);

    // After successful deletion, redirect to collection details or overview
    // router.push({ name: 'CollectionDetails', params: { id: template.value.collectionId } });
    alert(`Template "${prompt.value.name}" deleted successfully.`);
  }
};

const runEvaluation = async () => {
  if (!prompt.value) return;

  Array.from(promptVariables.value?.formInstance?.entries() || []).map(([key, obj]) => {
    testInputs[key] = obj.editableContent;
  })

  // Basic validation for test inputs
  for (const variable of prompt.value.variables) {
    if (variable.type === 'text' && !testInputs[variable.name]?.trim()) {
      alert(`Please provide input for parameter: ${variable.name}`);
      return;
    }
  }

  isEvaluating.value = true;
  evaluationResult.value = null; // Clear previous results
  try {
    const testPrompt = prompt.value.promptText.replace(/\{([A-Z0-9_]+)\}/g, (match, varName) => {
      const value = testInputs[varName];
      return value !== undefined ? String(value) : match; // Replace or keep original placeholder if not found
    });

    const genaiRequest: GenAIRequest = {
      prompt: testPrompt,
      modelName: 'gemini-2.0-flash'
    };
    const testResponse = await apiService.genai.GoogleAIStudio(genaiRequest);
    const llmResponse = testResponse.data.candidates[0].content.parts[0].text;

    const evaluatePromptTemplateId = promptEvaluationTemplate.value.formInstance?.get('selectPromptTemplate').editableContent;
    const evaluatePromptTemplate = store.prompt.prompts.get(evaluatePromptTemplateId);

    testInputs['AI_RESPONSE'] = llmResponse;
    testInputs['ORIGINAL_PROMPT_TEMPLATE'] = prompt.value.promptText;

    const evaluatePrompt = evaluatePromptTemplate?.promptText.replace(/\{([A-Z0-9_]+)\}/g, (match, varName) => {
      const value = testInputs[varName];
      return value !== undefined ? String(value) : match; // Replace or keep original placeholder if not found
    });
    genaiRequest.prompt = evaluatePrompt || '';
    const evaluateResponse = await apiService.genai.GoogleAIStudio(genaiRequest);
    const rawEvaluatorOutput = evaluateResponse.data.candidates[0].content.parts[0].text;;

    const md = new MarkdownIt({
      html: true,
      breaks: true,
    });
    const jsonRawEvaluatorOutput: EvaluationMetrics = md.parse(rawEvaluatorOutput, {}).reduce((acc, token) => {
      if (token.type === 'fence' && token.info === 'json') {
        let jsonContent = JSON.parse(token.content);
        return {...acc, ...jsonContent};
      }
    }, {
      prompt_template_clarity: 0,
      prompt_template_completeness: 0,
      ai_response_quality: 0,
      ai_response_relevance: 0,
      prompt_template_guidance: 0,
      optimization_suggestions: [],
    })

    const evaluatorReport = `The LLM response was highly relevant and addressed all key aspects of the prompt. The tone was appropriate. Overall, a very good response.`;

    evaluationResult.value = {
      llmResponse: llmResponse,
      evaluatorReport: jsonRawEvaluatorOutput || null,
      rawEvaluatorOutput: rawEvaluatorOutput,
    };

  } catch (error) {
    console.error('Error during evaluation:', error);
    alert('Failed to run evaluation. Please check your inputs and try again.');
  } finally {
    isEvaluating.value = false;
  }
};
</script>

<template>
  <Details
    :deleteButtonName="'Delete Template'"
    :editButtonName="'Edit Template'"
    :isLoading="isLoading"
    :loadingDescription="'Loading prompt template details...'"
    :detailsId="prompt?.id || ''"
    :detailsName="prompt?.name || ''"
    :detailsDescription="prompt?.description || ''"
    :detailsFoundDescription="'Prompt Template Not Found'"
    :detailsInfo="[
      {
        icon: FolderIcon,
        text: 'Repository:',
        linkName: repository?.name,
        linkTo: {name: 'RepositoryDetails', params: { id: prompt?.promptSetId }}
      },
      {
        icon: ClockIcon,
        text: `Created: ${format(prompt?.createdAt || new Date(), 'MMM d, yyyy')}`
      },
      {
        icon: ArrowPathIcon,
        text: `Last Modified: ${formatDistanceToNow(prompt?.updatedAt || new Date())} ago`
      }
    ]"
    :detailsTags="prompt?.tags || []"
    :goBackButtonName="'Back to List'"
    :goBackRouterName="'RepositoryOverview'"
    @editDetails="handleEditTemplate"
  >
    <template #content>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PromptContentViewSection />
        <PromptVariableViewSection :ref="'promptVariables'" />
      </div>

      <PromptEvaluationSection @runEvaluation="runEvaluation" :availablePrompTemplates="availablePrompTemplates" :isEvaluating="isEvaluating" :evaluationResult="evaluationResult" :ref="'promptEvaluationTemplate'" />
    </template>
  </Details>
</template>