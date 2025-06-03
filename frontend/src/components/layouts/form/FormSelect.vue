<script setup lang="ts">
import { FormProps } from '@/types/form';
import { ref } from 'vue';


const props = defineProps<FormProps>();
const editableContent = ref(props.content);
const hasMargin = ref(props.hasMargin || true);

defineExpose({
  editableContent
});
</script>

<template>
  <div :class="{'mb-5': hasMargin}">
    <label :for="labelId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ labelName }} <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <select
      id="collection"
      v-model="editableContent"
      required
      class="block w-full pl-3 pr-10 px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="" disabled>{{ optionName }}</option>
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>
    <p v-if="errors" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
  </div>
</template>