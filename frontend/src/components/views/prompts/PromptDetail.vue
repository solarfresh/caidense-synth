<script setup lang="ts">
import { apiService } from '@/api/apiService';
import Details from '@/components/layouts/detail/Details.vue';
import { usePromptStore } from '@/stores/prompt';
import { useRepositoryStore } from '@/stores/repository';
import type { EvaluationResult, Prompt } from '@/types/prompts';
import type { Repository } from '@/types/repositories';
import {
  ArrowPathIcon, // For empty evaluation state
  ClockIcon,
  // DocumentDuplicateIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns';
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
const promptVariables = ref();
const promptEvaluationTemplate = ref();
const repository = ref<Repository | null>(null);
const isLoading = ref(true);
const isEvaluating = ref(false);
const evaluationResult = ref<EvaluationResult | null>(null);
const showRawEvaluatorOutput = ref(false);

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

// Helper for evaluation score styling
const scoreClass = (score: number) => {
  if (score >= 4) return 'text-green-600 font-bold';
  if (score >= 3) return 'text-yellow-600 font-bold';
  return 'text-red-600 font-bold';
};

// Helper to render TextGrad insights with inline styles for demo
const renderTextGrad = (insights: EvaluationResult['textGradInsights']) => {
  if (!insights) return '';
  let html = '';
  insights.forEach(item => {
    const color = item.score > 0.5 ? 'green' : item.score < -0.5 ? 'red' : 'inherit'; // Simplified logic
    const weight = Math.abs(item.score) > 0.3 ? 'font-semibold' : ''; // Simplified
    html += `<span style="color: ${color};" class="${weight}">${item.text}</span>`;
  });
  return html;
};

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

  console.log('========= promptVariables =========');
  console.log(promptVariables.value);
  console.log('========= promptEvaluationTemplate =========');
  console.log(promptEvaluationTemplate.value);
  // Basic validation for test inputs
  // for (const variable of prompt.value.variables) {
  //   if (variable.type === 'text' && !testInputs[variable.name]?.trim()) {
  //     alert(`Please provide input for parameter: ${variable.name}`);
  //     return;
  //   }
  // }

  isEvaluating.value = true;
  evaluationResult.value = null; // Clear previous results
  try {
    // Simulate complex evaluation process involving two LLM calls + TextGrad
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 1. Simulate LLM A (Content Generation)
    const filledPrompt = prompt.value.promptText.replace(/\{([A-Z0-9_]+)\}/g, (match, varName) => {
      const value = testInputs[varName];
      return value !== undefined ? String(value) : match; // Replace or keep original placeholder if not found
    });
    const llmResponse = `Simulated LLM response for "${prompt.value.name}" using inputs: ${JSON.stringify(testInputs)}. This response aims to ${prompt.value.description.toLowerCase()}. Example output based on prompt: "The summarized text covers key points about AI, including its history, current applications, and future impact on society."`;

    // 2. Simulate LLM B (Evaluator Prompt)
    const evaluatorReport = `The LLM response was highly relevant and addressed all key aspects of the prompt. The tone was appropriate. Overall, a very good response.`;
    const rawEvaluatorOutput = JSON.stringify({
        overall_score: 4.5,
        relevance: 5,
        accuracy: 4,
        completeness: 4.5,
        tone: 5,
        safety: 5,
        reasoning: "The response directly answered the prompt's request for a summary, covering the key points comprehensively and maintaining a neutral tone. There were no factual errors found.",
        suggestions: "Consider adding a specific length constraint to the prompt for more consistent summary outputs."
    }, null, 2);

    // 3. Simulate TextGrad insights (simplified for demo)
    const textGradInsights = [
      { text: 'Summarize', score: 0.7 },
      { text: 'the', score: 0.1 },
      { text: 'following', score: 0.15 },
      { text: 'text', score: 0.6 },
      { text: 'in', score: 0.05 },
      { text: testInputs['TONE'] || 'neutral', score: 0.4 }, // Example: influence of TONE param
      { text: 'tone', score: 0.3 },
      { text: ':', score: 0.01 },
      { text: testInputs['TEXT']?.substring(0,20) || 'input text...', score: 0.8 }, // Example: influence of TEXT param
      { text: '...', score: 0.05 },
      { text: 'Final Answer: ', score: 0.2 },
      { text: 'The summarized text was excellent.', score: 0.9 },
      { text: 'No issues found.', score: -0.1 } // Example of potential negative impact area
    ];

    evaluationResult.value = {
      llmResponse: llmResponse,
      evaluatorReport: evaluatorReport,
      rawEvaluatorOutput: rawEvaluatorOutput,
      score: 4.5, // Extract from rawEvaluatorOutput in real app
      textGradInsights: textGradInsights,
      optimizationSuggestions: "Consider adding a specific length constraint to the prompt for more consistent summary outputs. Explore alternative phrasing for 'following text' to enhance clarity.",
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

      <PromptEvaluationSection @runEvaluation="runEvaluation" :availablePrompTemplates="availablePrompTemplates" :isEvaluating="isEvaluating" :evaluationResult="evaluationResult" />
    </template>
  </Details>
</template>