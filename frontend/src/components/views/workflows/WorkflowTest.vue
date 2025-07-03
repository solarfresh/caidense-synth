<script setup lang="ts">
import { apiService } from '@/api/apiService';
import TestButton from '@/components/base/buttons/TestButton.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
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

const testOutputs = ref({});

const requestContent = computed(() => {
  if (!submitFormData.value?.config) return;

  const obj = submitFormData.value.config.inputs;
  return JSON.stringify(obj, null, 2);
});

const submitFormData = computed(() => {
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
  if (!submitFormData.value) return;
  const response = await apiService.workflow.executeWorkflow(submitFormData.value as CreateExecution);
  testOutputs.value = response.data.data.variables;
};
</script>

<template>
<FormTextarea :label-name="'Request Payload'" :label-id="'testRequest'" :content="requestContent" :rows="10" />

<div class="mt-5 sm:mt-6 space-x-2 flex justify-end">
  <TestButton @click="handleTest" :button-name="'Run Test'" />
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