<script setup lang="ts">
import { apiService } from '@/api/apiService';
import ExecuteButton from '@/components/base/buttons/ExecuteButton.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { FormInstance } from '@/types/form';
import type { CreateExecution, Variable } from '@/types/workflow';
import { PropType, computed, ref } from 'vue';


const props = defineProps({
  thinkingId: {
    type: String,
    required: true,
  },
  workflowInputs: {
    type: Array as PropType<Variable[]>,
    required: false
  }
})

const isRunning = ref<Boolean>(false);
const requestPayload = ref<FormInstance | null>(null);
const testOutputs = ref({});

const requestContent = computed(() => {
  if (!defaultFormData.value?.config) return;

  const obj = defaultFormData.value.config.inputs;
  return JSON.stringify(obj, null, 2);
});

const defaultFormData = computed(() => {
  let obj = props.workflowInputs?.reduce((acc, variable: Variable) => {
    let defaultValue = undefined;
    switch (variable.type) {
      case 'text':
        defaultValue = variable.defaultValue ? variable.defaultValue : variable.description;
        break;
      case 'number':
        defaultValue = variable.defaultValue ? variable.defaultValue : 0;
        break;
      default:
        defaultValue = '';
    }
    acc[variable.name] = defaultValue;
    return acc;
  }, {} as {[key: string]: any});

  return {
    thinkingId: props.thinkingId,
    config: {
      inputs: obj
    }
  }
});

const handleTest = async () => {
  if (!requestPayload.value) return;

  isRunning.value = true;
  const submitFormData = {
    thinkingId: props.thinkingId,
    config: {
      inputs: JSON.parse(requestPayload.value.editableContent as string),
    }
  };

  const response = await apiService.workflow.executeWorkflow(submitFormData as CreateExecution);
  testOutputs.value = response.data.data.variables;
  isRunning.value = false;
};
</script>

<template>
<FormTextarea :label-name="'Request Payload'" :label-id="'testRequest'" :content="requestContent" :rows="10" :ref="'requestPayload'" />

<div class="mt-5 sm:mt-6 space-x-2 flex justify-end">
  <ExecuteButton @click="handleTest" :is-running="isRunning.valueOf()" :button-name="'Run'" :dynamic-button-name="'Running...'" />
</div>

<div class="mt-5">
  <h3 class="text-lg font-medium text-gray-800 mb-4">Results</h3>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div v-for="[key, value] in Object.entries(testOutputs)" class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h4 class="text-lg font-medium text-gray-800 mb-3">{{ key }}:</h4>
      <div class="bg-gray-50 p-4 rounded-md text-sm border border-gray-200">
        {{ value }}
      </div>
    </div>
  </div>
</div>

</template>