<script setup lang="ts">
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import type { Variable } from '@/types/workflow';
import { PropType, computed, ref } from 'vue';
import TestButton from '@/components/base/buttons/TestButton.vue';


const props = defineProps({
  workflowInputs: {
    type: Array as PropType<Variable[]>,
    required: false
  }
})

const testOutputs = ref({});

const requestContent = computed(() => {
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

  return JSON.stringify(obj, null, 2);
});

const handleTest = () => {};
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