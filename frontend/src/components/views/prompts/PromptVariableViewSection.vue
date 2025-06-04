<script setup lang="ts">
import DetailsSection from '@/components/layouts/detail/DetailsSection.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { usePromptStore } from '@/stores/prompt';
import type { FormInstance } from '@/types/form';
import type { Prompt } from '@/types/prompts';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import { onMounted, reactive, ref } from 'vue';


const store = usePromptStore();
const prompt = ref<Prompt | null>();
const formInstance = reactive<Map<string, FormInstance>>(new Map());

onMounted(async () => {
  prompt.value = store.getPrompt || null;
});

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
  <DetailsSection :title="`Variables (${prompt?.variables.length})`">
    <template #fields>
      <div v-if="prompt?.variables.length === 0" class="text-gray-600 italic">
        <InformationCircleIcon class="h-6 w-6 text-gray-400 inline-block align-middle mr-1" />
        No variables defined for this template.
      </div>
      <div v-else class="mb-6 bg-gray-50 p-6 rounded-md border border-gray-200">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Test Inputs:</h3>
        <div class="space-y-4">
          <div v-for="variable in prompt?.variables" :key="variable.name">
            <FormTextarea v-if="variable.type === 'text'" :labelId="`test-input-${variable.name}`" :labelName="variable.name" :subLabelName="`(${variable.type})`" :placeholder="variable.description || `Enter value for ${variable.name}`" :ref="el => registerRef(`test-input-${variable.name}`, el)" />
            <FormInput v-else-if="variable.type === 'number'" :type="'number'" :labelId="`test-input-${variable.name}`" :labelName="variable.name" :subLabelName="`(${variable.type})`" :placeholder="variable.description || `Enter value for ${variable.name}`" :ref="el => registerRef(`test-input-${variable.name}`, el)" />
            <FormSelect v-else-if="variable.type === 'enum' && variable.enumOptions" :labelId="`test-input-${variable.name}`" :labelName="variable.name" :subLabelName="`(${variable.type})`" :options="variable.enumOptions" :ref="el => registerRef(`test-input-${variable.name}`, el)" />
            <FormInput v-else-if="variable.type === 'boolean'" :type="'checkbox'" :labelId="`test-input-${variable.name}`" :labelName="variable.name" :subLabelName="`(${variable.type})`" :placeholder="variable.description || `Enter value for ${variable.name}`" :ref="el => registerRef(`test-input-${variable.name}`, el)" />
          </div>
        </div>
      </div>
    </template>
  </DetailsSection>
</template>