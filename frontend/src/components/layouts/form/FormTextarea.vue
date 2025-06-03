<script setup lang="ts">
import { FormProps } from '@/types/form';
import { ref } from 'vue';


const props = defineProps<FormProps>();
const emits = defineEmits<{
  (e: 'input'): void;
}>();
const editableContent = ref(props.content)
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
    <textarea
      :id="labelId"
      v-model="editableContent"
      rows="4"
      class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      :placeholder="placeholder"
      @input="$emit('input')"
    ></textarea>
    <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    <p v-if="errors" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
  </div>
</template>