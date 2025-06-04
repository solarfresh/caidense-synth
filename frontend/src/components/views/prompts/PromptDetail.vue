// src/views/PromptTemplateDetails.vue
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  FolderIcon,
  BoltIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ClipboardDocumentListIcon // For empty evaluation state
} from '@heroicons/vue/24/outline'; // Or /20/outline for smaller icons
import { format, formatDistanceToNow } from 'date-fns';

// --- Interfaces for Data ---
type ParameterType = 'text' | 'number' | 'boolean' | 'enum';

interface PromptParameter {
  name: string;
  type: ParameterType;
  description: string;
  enumOptions?: string[]; // Only for 'enum' type
}

interface PromptTemplateDetails {
  id: string;
  name: string;
  description: string;
  content: string;
  collectionId: string;
  collectionName: string; // To display collection name directly
  createdAt: Date;
  lastModified: Date;
  createdBy: string;
  parameters: PromptParameter[];
}

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

const template = ref<PromptTemplateDetails | null>(null);
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
  // const collectionId = route.params.collectionId as string;
  const collectionId = 'coll-001';
  // const templateId = route.params.id as string;
  const templateId = 'temp-101';

  if (!templateId) {
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    // Simulate API call to fetch template details
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Mock Data based on IDs (replace with actual API fetch)
    const fetchedTemplate: PromptTemplateDetails | undefined = mockTemplatesData.find(
      (t) => t.collectionId === collectionId && t.id === templateId
    );

    if (fetchedTemplate) {
      // Ensure Date objects if fetching from JSON/string dates
      fetchedTemplate.createdAt = new Date(fetchedTemplate.createdAt);
      fetchedTemplate.lastModified = new Date(fetchedTemplate.lastModified);
      template.value = fetchedTemplate;

      // Initialize testInputs based on template parameters
      template.value.parameters.forEach(param => {
        if (param.type === 'boolean') {
          testInputs[param.name] = false; // Default for boolean
        } else if (param.type === 'number') {
          testInputs[param.name] = 0; // Default for number
        } else if (param.type === 'enum' && param.enumOptions && param.enumOptions.length > 0) {
          testInputs[param.name] = param.enumOptions[0]; // Default to first option
        } else {
          testInputs[param.name] = ''; // Default for text
        }
      });

    } else {
      template.value = null; // Mark as not found
    }
  } catch (error) {
    console.error('Error fetching template details:', error);
    template.value = null; // Mark as not found on error
    alert('Failed to load template details. Please try again.');
  } finally {
    isLoading.value = false;
  }
});

// --- Computed Properties / Helpers ---

// Helper to parse prompt content for highlighting parameters
const parsePromptContent = (content: string) => {
  const parts = [];
  const regex = /(\[[A-Z0-9_]+\])/g; // Matches [PARAM_NAME]
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
  if (template.value) {
    router.push({ name: 'EditPromptTemplate', params: { collectionId: template.value.collectionId, templateId: template.value.id } });
  }
};

const handleDuplicateTemplate = () => {
  if (template.value) {
    // Navigate to CreatePromptTemplate page, pre-filling with current template's data
    // This typically means passing data via route query or a state management store
    router.push({
      name: 'CreatePromptTemplate',
      query: {
        collectionId: template.value.collectionId,
        duplicateFrom: template.value.id, // Indicate it's a duplication
      },
    });
    alert('Simulating duplication: You will be redirected to a new template creation page with pre-filled data.');
  }
};

const handleDeleteTemplate = async () => {
  if (!template.value) return;

  if (confirm(`Are you sure you want to delete the template "${template.value.name}"? This action cannot be undone.`)) {
    console.log('Deleting template:', template.value.id);
    // In a real app: make API call to delete template
    // await api.deleteTemplate(template.value.collectionId, template.value.id);

    // After successful deletion, redirect to collection details or overview
    // router.push({ name: 'CollectionDetails', params: { id: template.value.collectionId } });
    alert(`Template "${template.value.name}" deleted successfully.`);
  }
};

const runEvaluation = async () => {
  if (!template.value) return;

  // Basic validation for test inputs
  for (const param of template.value.parameters) {
    if (param.type === 'text' && !testInputs[param.name]?.trim()) {
      alert(`Please provide input for parameter: ${param.name}`);
      return;
    }
  }

  isEvaluating.value = true;
  evaluationResult.value = null; // Clear previous results
  try {
    // Simulate complex evaluation process involving two LLM calls + TextGrad
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 1. Simulate LLM A (Content Generation)
    const filledPrompt = template.value.content.replace(/\[([A-Z0-9_]+)\]/g, (match, paramName) => {
      const value = testInputs[paramName];
      return value !== undefined ? String(value) : match; // Replace or keep original placeholder if not found
    });
    const llmResponse = `Simulated LLM response for "${template.value.name}" using inputs: ${JSON.stringify(testInputs)}. This response aims to ${template.value.description.toLowerCase()}. Example output based on prompt: "The summarized text covers key points about AI, including its history, current applications, and future impact on society."`;

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

// --- Mock Data (for demonstration) ---
const mockTemplatesData: PromptTemplateDetails[] = [
  {
    id: 'temp-101',
    name: 'Summarize Article',
    description: 'Summarizes a given article content into a concise overview, allowing a specified tone.',
    content: 'Please summarize the following article in a [TONE] tone. The article is:\n\n[ARTICLE_TEXT]',
    collectionId: 'coll-001',
    collectionName: 'General Purpose Prompts',
    createdAt: new Date('2024-01-20T10:00:00Z'),
    lastModified: new Date('2025-05-29T10:00:00Z'),
    createdBy: 'Alice_W',
    parameters: [
      { name: 'ARTICLE_TEXT', type: 'text', description: 'The full text of the article to be summarized.' },
      { name: 'TONE', type: 'enum', description: 'The desired tone for the summary.', enumOptions: ['formal', 'informal', 'neutral', 'witty'] },
    ],
  },
  {
    id: 'temp-201',
    name: 'Customer Refund Request Handler',
    description: 'Generates a polite response to a customer refund request, based on their order details and reason.',
    content: 'Customer request:\nOrder ID: [ORDER_ID]\nReason: [REFUND_REASON]\n\nPlease generate a polite and clear response to this refund request. Indicate if a refund is approved or requires further review.',
    collectionId: 'coll-002',
    collectionName: 'Customer Service Bot Prompts',
    createdAt: new Date('2024-03-10T11:30:00Z'),
    lastModified: new Date('2025-05-29T17:00:00Z'),
    createdBy: 'Bob_T',
    parameters: [
      { name: 'ORDER_ID', type: 'text', description: 'The customer\'s order identification number.' },
      { name: 'REFUND_REASON', type: 'text', description: 'The reason provided by the customer for the refund request.' },
    ],
  },
  {
    id: 'temp-301',
    name: 'Simple Q&A',
    description: 'Answers a simple question based on general knowledge.',
    content: 'Answer the following question: [QUESTION]',
    collectionId: 'coll-001',
    collectionName: 'General Purpose Prompts',
    createdAt: new Date('2024-02-01T14:00:00Z'),
    lastModified: new Date('2025-05-28T12:00:00Z'),
    createdBy: 'Alice_W',
    parameters: [
      { name: 'QUESTION', type: 'text', description: 'The question to be answered.' },
    ],
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <div v-if="isLoading" class="text-center py-20">
        <ArrowPathIcon class="h-10 w-10 text-indigo-500 animate-spin mx-auto mb-4" />
        <p class="text-lg text-gray-600">Loading template details...</p>
      </div>

      <div v-else-if="!template" class="text-center py-20">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Template Not Found</h2>
        <p class="text-gray-600 mb-6">The prompt template you are looking for does not exist or you don't have access.</p>
        <button
          @click="router.back()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go Back
        </button>
      </div>

      <div v-else>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div class="mb-4 md:mb-0">
            <button
              @click="router.back()"
              class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out group"
            >
              <ArrowLeftIcon class="h-5 w-5 mr-1.5 text-indigo-500 group-hover:text-indigo-700" />
              Back to Collection
            </button>
          </div>

          <h1 class="text-4xl font-extrabold text-gray-900 flex-grow text-center md:text-left md:ml-4">
            {{ template.name }}
          </h1>

          <div class="flex space-x-3 mt-4 md:mt-0">
            <button
              @click="handleEditTemplate"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilSquareIcon class="h-5 w-5 mr-2" /> Edit Template
            </button>
            <button
              @click="handleDuplicateTemplate"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <DocumentDuplicateIcon class="h-5 w-5 mr-2" /> Duplicate
            </button>
            <button
              @click="handleDeleteTemplate"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon class="h-5 w-5 mr-2" /> Delete
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <p class="text-gray-700 text-lg mb-4">{{ template.description || 'No description provided for this template.' }}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 text-sm text-gray-600">
            <div class="flex items-center">
              <FolderIcon class="h-4 w-4 mr-2 text-gray-500" />
              Collection: <div class="font-medium text-indigo-600 hover:underline ml-1">{{ template.collectionName }}</div>
            </div>
            <div class="flex items-center">
              <ClockIcon class="h-4 w-4 mr-2 text-gray-500" />
              Created: {{ format(template.createdAt, 'MMM d, yyyy') }}
            </div>
            <div class="flex items-center">
              <ArrowPathIcon class="h-4 w-4 mr-2 text-gray-500" />
              Last Modified: {{ formatDistanceToNow(template.lastModified) }} ago
            </div>
            <div class="flex items-center">
              <UserIcon class="h-4 w-4 mr-2 text-gray-500" />
              Created By: {{ template.createdBy }}
            </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Prompt Content</h2>
            <div class="bg-gray-50 font-mono p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
              <span v-for="(part, index) in parsePromptContent(template.content)" :key="index">
                <span v-if="part.type === 'text'">{{ part.value }}</span>
                <span v-else class="text-indigo-600 font-semibold bg-indigo-100 px-1 py-0.5 rounded-sm">[{{ part.value }}]</span>
              </span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Parameters ({{ template.parameters.length }})</h2>
            <div v-if="template.parameters.length === 0" class="text-gray-600 italic">
              <InformationCircleIcon class="h-6 w-6 text-gray-400 inline-block align-middle mr-1" />
              No parameters defined for this template.
            </div>
            <ul v-else class="space-y-4">
              <li v-for="param in template.parameters" :key="param.name" class="p-3 bg-gray-50 rounded-md border border-gray-200">
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
              <div v-for="param in template.parameters" :key="param.name">
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
      </div>
    </div>
  </div>
</template>