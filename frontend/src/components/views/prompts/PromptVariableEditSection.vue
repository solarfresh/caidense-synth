<script setup lang="ts">
import CreateButton from '@/components/base/buttons/CreateButton.vue';
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import type { CreateVariable } from '@/types/common';
import { FormErrors } from '@/types/form';
import { InformationCircleIcon } from '@heroicons/vue/20/solid';
import { reactive, ref, watch } from 'vue';


const props = defineProps({
  variables: {
    type: Array<CreateVariable>,
    required: true
  }
})
const emits = defineEmits<{
  (e: 'createVariables'): void;
}>();

const errors = reactive<FormErrors>({name: undefined});
const editableVariables = ref<CreateVariable[]>(props.variables)

watch(() => props.variables, (newValue) => {
  editableVariables.value = newValue;
}, {immediate: true});

const addVariable = () => {
  editableVariables.value.push({
    name: '',
    type: 'text',
    description: '',
  });
};

const removeVariable = (index: number) => {
  editableVariables.value.splice(index, 1);
};

defineExpose({
  editableVariables
});
</script>

<template>
  <section class="mb-8 border-b pb-6 border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
      Variables
      <CreateButton @click="addVariable" :buttonName="'Add Variable'" />
    </h2>

    <div v-if="variables.length === 0" class="bg-gray-50 p-6 rounded-md text-center text-gray-600">
      <InformationCircleIcon class="h-8 w-8 mx-auto text-gray-400 mb-3" />
      <p class="text-sm">No variables defined yet. Variables will be automatically extracted from your prompt, or you can add them manually.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(variable, index) in editableVariables"
        :key="index"
        class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-md border border-gray-200"
      >
        <div>
          <label :for="`variable-name-${index}`" class="block text-xs font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
          <input
            type="text"
            :id="`variable-name-${index}`"
            v-model="variable.name"
            required
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors[`variable-${index}-name`] }"
            placeholder="e.g., TEXT, TONE"
          />
          <p v-if="errors[`variable-${index}-name`]" class="mt-1 text-xs text-red-600">{{ errors[`variable-${index}-name`] }}</p>
        </div>

        <div>
          <label :for="`variable-type-${index}`" class="block text-xs font-medium text-gray-700 mb-1">Type <span class="text-red-500">*</span></label>
          <select
            :id="`variable-type-${index}`"
            v-model="variable.type"
            required
            class="block w-full pl-2 pr-8 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="enum">Dropdown/Enum</option>
          </select>
        </div>

        <div>
          <label :for="`variable-desc-${index}`" class="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            :id="`variable-desc-${index}`"
            v-model="variable.description"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., The article content"
          />
        </div>

        <div class="md:col-span-1 flex justify-end">
          <DeleteButton @click="removeVariable(index)" :buttonName="'Remove Variable'" />
        </div>

        <div v-if="variable.type === 'enum'" class="md:col-span-4 mt-2">
          <label :for="`enum-options-${index}`" class="block text-xs font-medium text-gray-700 mb-1">Enum Options (comma-separated)</label>
          <input
            type="text"
            :id="`enum-options-${index}`"
            v-model="variable.enumOptionsInput"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., formal, informal, witty"
          />
          <p v-if="errors[`variable-${index}-enumOptions`]" class="mt-1 text-xs text-red-600">{{ errors[`variable-${index}-enumOptions`] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>