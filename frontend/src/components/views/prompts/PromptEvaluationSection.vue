<script setup lang="ts">
import ExecuteButton from '@/components/base/buttons/ExecuteButton.vue';
import Markdown from '@/components/base/content/Markdown.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import type { FormInstance } from '@/types/form';
import type { EvaluationMetrics, EvaluationResult } from '@/types/prompts';
import { ClipboardDocumentListIcon } from '@heroicons/vue/24/outline';
import { PropType, reactive, ref, watch } from 'vue';


const props = defineProps({
  availablePrompTemplates: {
    type: Array,
    default: []
  },
  isEvaluating: {
    type: Boolean,
    default: false,
  },
  evaluationResult: {
    type: Object as PropType<EvaluationResult | null>,
    default: null
  },
});

const showRawEvaluatorOutput = ref(false);
const formInstance = reactive<Map<string, FormInstance>>(new Map());
const evaluationMetrics = ref<EvaluationMetrics | null>(null);
const evaluationScore = ref<string>('');
const optimizationSuggestions = ref<Array<string>>([])

const emits = defineEmits<{
  (e: 'runEvaluation'): void;
}>();

watch(() => props.evaluationResult, (newValue) => {
  evaluationMetrics.value = newValue?.evaluatorReport || null;
  const prompt_template_clarity = evaluationMetrics.value?.prompt_template_clarity || 0;
  const prompt_template_completeness = evaluationMetrics.value?.prompt_template_completeness || 0;
  const ai_response_quality = evaluationMetrics.value?.ai_response_quality || 0;
  const ai_response_relevance = evaluationMetrics.value?.ai_response_relevance || 0;
  const prompt_template_guidance = evaluationMetrics.value?.prompt_template_guidance || 0;
  evaluationScore.value = ((prompt_template_clarity + prompt_template_completeness + ai_response_quality + ai_response_relevance + prompt_template_guidance) / 5).toFixed(1);
  optimizationSuggestions.value = evaluationMetrics.value?.optimization_suggestions || [];
}, {immediate: true});

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

// Helper for evaluation score styling
const scoreClass = (score: number) => {
  if (score >= 4) return 'text-green-600 font-bold';
  if (score >= 3) return 'text-yellow-600 font-bold';
  return 'text-red-600 font-bold';
};

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}

defineExpose({
  formInstance
});
</script>

<template>
  <section class="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 py-2">Evaluation & Optimization</h2>
      <FormSelect :labelId="'selectPromptTemplate'" :labelName="'Evaluation Template'" :options="availablePrompTemplates" :ref="el => registerRef('selectPromptTemplate', el)" />
      <ExecuteButton @click="$emit('runEvaluation')" :isEvaluating="isEvaluating" :buttonName="'Run Evaluation'" :dynamicButtonName="'Evaluating...'" />
    </div>

<!--
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
-->
    <div v-if="evaluationResult" class="mt-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Evaluation Results:</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 class="text-lg font-medium text-gray-800 mb-3">LLM Response:</h4>
          <div class="bg-gray-50 p-4 rounded-md text-sm border border-gray-200">
            <Markdown :markdownText="evaluationResult.llmResponse" />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h4 class="text-lg font-medium text-gray-800 mb-3">Evaluator Report:</h4>
          <div class="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
            <p class="mb-2 font-medium">Overall Score: <span :class="scoreClass(Number(evaluationScore))">{{ evaluationScore }}/5</span></p>
            <ul class="list-disc px-4">
              <li v-for="suggestion in optimizationSuggestions">{{ suggestion }}</li>
            </ul>
          </div>
          <button
            @click="showRawEvaluatorOutput = !showRawEvaluatorOutput"
            class="mt-3 text-sm text-indigo-600 hover:underline"
          >
            {{ showRawEvaluatorOutput ? 'Hide Raw Output' : 'Show Raw Evaluator Output' }}
          </button>
          <pre v-if="showRawEvaluatorOutput" class="bg-gray-100 p-3 rounded-md text-xs mt-2 overflow-auto">
            <Markdown class="prose-code:bg-gray-100" :markdownText="evaluationResult.rawEvaluatorOutput" />
          </pre>
        </div>
      </div>

<!--
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
-->
    </div>
    <div v-else class="mt-8 bg-gray-100 p-8 rounded-md text-center text-gray-600">
      <ClipboardDocumentListIcon class="h-10 w-10 mx-auto text-gray-400 mb-4" />
      <p class="text-lg">Run an evaluation above to see prompt performance and optimization insights.</p>
    </div>
  </section>
</template>