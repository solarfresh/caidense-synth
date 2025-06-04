<script setup lang="ts">
import Details from '@/components/layouts/detail/Details.vue';
import {
  ArrowPathIcon,
  BoltIcon,
  ClipboardDocumentListIcon, // For empty evaluation state
  ClockIcon,
  // DocumentDuplicateIcon,
  FolderIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePromptStore } from '@/stores/prompt';
import { useRepositoryStore } from '@/stores/repository';
import type { Prompt } from '@/types/prompts';
import type { Repository } from '@/types/repositories';
import { apiService } from '@/api/apiService';


const store = {
  repository: useRepositoryStore(),
  prompt: usePromptStore(),
};
interface EvaluationResult {
  llmResponse: string;
  evaluatorReport: string; // The summarized evaluation report from the evaluator LLM
  rawEvaluatorOutput: string; // The full raw output from the evaluator LLM (e.g., JSON)
  score: number; // Overall score (e.g., 1-5)
  textGradInsights?: Array<{ text: string; score: number; }>; // TextGrad data [{text: 'word', score: 0.8}, {text: 'another', score: -0.2}]
  optimizationSuggestions?: string; // Textual suggestions based on TextGrad
}

// --- State Management ---
const route = useRoute();
const router = useRouter();

const prompt = ref<Prompt | null>(null);
const repository = ref<Repository | null>(null);
const isLoading = ref(true);
const isEvaluating = ref(false);
const evaluationResult = ref<EvaluationResult | null>(null);
const showRawEvaluatorOutput = ref(false);

// For testing inputs
const testInputs = reactive<{ [key: string]: any }>({});
const selectedLLMModel = ref('model-gpt4o'); // Default LLM for generating response
const selectedEvaluatorModel = ref('model-gpt4o'); // Default LLM for evaluation

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

      // Initialize testInputs based on template parameters
    prompt.value.variables.forEach(variable => {
      if (variable.type === 'boolean') {
        testInputs[variable.name] = false; // Default for boolean
      } else if (variable.type === 'number') {
        testInputs[variable.name] = 0; // Default for number
      } else if (variable.type === 'enum' && variable.enumOptions && variable.enumOptions.length > 0) {
        testInputs[variable.name] = variable.enumOptions[0]; // Default to first option
      } else {
        testInputs[variable.name] = ''; // Default for text
      }
    });
  } catch (error) {
    console.error('Error fetching template details:', error);
    prompt.value = null; // Mark as not found on error
    alert('Failed to load template details. Please try again.');
  } finally {
    isLoading.value = false;
  }
});

// --- Computed Properties / Helpers ---

// Helper to parse prompt content for highlighting parameters
const parsePromptContent = (content: string) => {
  const parts = [];
  const regex = /(\{[A-Z0-9_]+\})/g; // Matches [PARAM_NAME]
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
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Prompt Content</h2>
          <div class="bg-gray-50 font-mono p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
            <span v-for="(part, index) in parsePromptContent(prompt?.promptText || '')" :key="index">
              <span v-if="part.type === 'text'">{{ part.value }}</span>
              <span v-else class="text-indigo-600 font-semibold bg-indigo-100 px-1 py-0.5 rounded-sm">[{{ part.value }}]</span>
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Parameters ({{ prompt?.variables.length }})</h2>
          <div v-if="prompt?.variables.length === 0" class="text-gray-600 italic">
            <InformationCircleIcon class="h-6 w-6 text-gray-400 inline-block align-middle mr-1" />
            No parameters defined for this template.
          </div>
          <ul v-else class="space-y-4">
            <li v-for="param in prompt?.variables" :key="param.name" class="p-3 bg-gray-50 rounded-md border border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-md font-medium text-gray-900">{{ param.name }}</h3>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ param.type }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ param.description || 'No description.' }}</p>
              <p v-if="param.type === 'enum' && param.enumOptions && param.enumOptions.length" class="text-xs text-gray-500 mt-1">
                Options: {{ param.enumOptions.join(', ') }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <section class="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Evaluation & Optimization</h2>

        <div class="mb-6 flex items-center space-x-4">
          <label for="llmModel" class="block text-sm font-medium text-gray-700">LLM Model:</label>
          <select
            id="llmModel"
            v-model="selectedLLMModel"
            class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="model-gpt4o">GPT-4o</option>
            <option value="model-claude3opus">Claude 3 Opus</option>
            <option value="model-gemini1.5pro">Gemini 1.5 Pro</option>
          </select>
          <label for="evaluatorModel" class="block text-sm font-medium text-gray-700">Evaluator Model:</label>
          <select
            id="evaluatorModel"
            v-model="selectedEvaluatorModel"
            class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="model-gpt4o">GPT-4o</option>
            <option value="model-claude3opus">Claude 3 Opus</option>
            <option value="model-gemini1.5pro">Gemini 1.5 Pro</option>
          </select>
        </div>

        <div class="mb-6 bg-gray-50 p-6 rounded-md border border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-3">Test Inputs:</h3>
          <div class="space-y-4">
            <div v-for="param in prompt?.variables" :key="param.name">
              <label :for="`test-input-${param.name}`" class="block text-sm font-medium text-gray-700 mb-1">
                {{ param.name }} <span class="text-gray-500 text-xs">({{ param.type }})</span>
              </label>
              <input
                v-if="param.type === 'text' || param.type === 'number'"
                :type="param.type === 'number' ? 'number' : 'text'"
                :id="`test-input-${param.name}`"
                v-model="testInputs[param.name]"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="param.description || `Enter value for ${param.name}`"
              />
              <select
                v-else-if="param.type === 'enum' && param.enumOptions"
                :id="`test-input-${param.name}`"
                v-model="testInputs[param.name]"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option v-for="option in param.enumOptions" :key="option" :value="option">{{ option }}</option>
              </select>
              <input
                v-else-if="param.type === 'boolean'"
                type="checkbox"
                :id="`test-input-${param.name}`"
                v-model="testInputs[param.name]"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
          </div>
          <button
            @click="runEvaluation"
            :disabled="isEvaluating"
            class="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BoltIcon v-if="!isEvaluating" class="-ml-1 mr-2 h-5 w-5" />
            <ArrowPathIcon v-else class="-ml-1 mr-2 h-4 w-4 animate-spin" />
            {{ isEvaluating ? 'Evaluating...' : 'Run Evaluation' }}
          </button>
        </div>

        <div v-if="evaluationResult" class="mt-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Evaluation Results:</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 class="text-lg font-medium text-gray-800 mb-3">LLM Response:</h4>
              <div class="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
                {{ evaluationResult.llmResponse }}
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 class="text-lg font-medium text-gray-800 mb-3">Evaluator Report:</h4>
              <div class="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
                <p class="mb-2 font-medium">Overall Score: <span :class="scoreClass(evaluationResult.score)">{{ evaluationResult.score }}/5</span></p>
                <p>{{ evaluationResult.evaluatorReport }}</p>
              </div>
              <button
                @click="showRawEvaluatorOutput = !showRawEvaluatorOutput"
                class="mt-3 text-sm text-indigo-600 hover:underline"
              >
                {{ showRawEvaluatorOutput ? 'Hide Raw Output' : 'Show Raw Evaluator Output' }}
              </button>
              <pre v-if="showRawEvaluatorOutput" class="bg-gray-100 p-3 rounded-md text-xs mt-2 overflow-auto">{{ evaluationResult.rawEvaluatorOutput }}</pre>
            </div>
          </div>

          <div class="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">TextGrad Insights:</h3>
            <p class="text-sm text-gray-600 mb-4">
              TextGrad highlights parts of your prompt that had the most significant impact on the LLM's response.
              <span class="font-semibold text-green-700">Green</span> indicates positive influence,
              <span class="font-semibold text-red-700">Red</span> indicates negative influence.
            </p>
            <div class="bg-gray-50 font-mono p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
              <p v-if="!evaluationResult.textGradInsights">Run evaluation to see TextGrad insights.</p>
              <div v-else v-html="renderTextGrad(evaluationResult.textGradInsights)"></div>
            </div>
            <p v-if="evaluationResult.optimizationSuggestions" class="mt-4 text-gray-700 text-sm">
              <strong>Optimization Suggestions:</strong> {{ evaluationResult.optimizationSuggestions }}
            </p>
          </div>
        </div>
        <div v-else class="mt-8 bg-gray-100 p-8 rounded-md text-center text-gray-600">
          <ClipboardDocumentListIcon class="h-10 w-10 mx-auto text-gray-400 mb-4" />
          <p class="text-lg">Run an evaluation above to see prompt performance and optimization insights.</p>
        </div>
      </section>
    </template>
  </Details>
</template>