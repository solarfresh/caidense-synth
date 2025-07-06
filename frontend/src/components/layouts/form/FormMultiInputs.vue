<script setup lang="ts">
import AddButton from '@/components/base/buttons/AddButton.vue';
import RemoveButton from '@/components/base/buttons/RemoveButton.vue';
import { FormProps } from '@/types/form';
import { ref, watch } from 'vue';


const props = defineProps<FormProps>();
const editableContents = ref(props.content);
const hasMargin = ref(props.hasMargin || true);

const emits = defineEmits<{
  (e: 'add'): void;
  (e: 'remove'): void;
}>();

watch(() => props.content, (newValue) => {
  editableContents.value = newValue;
});

defineExpose({
  editableContents
});
</script>

<template>
  <div :class="{'mb-5': hasMargin}">
    <label :for="labelId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ labelName }}
      <span v-if="isRequired" class="text-red-500">*</span>
      <span v-else-if="subLabelName" class="text-gray-500 text-xs">({{ subLabelName }})</span>
    </label>
    <div v-for="(editableContent, index) in editableContents" :key="index" class="flex items-center mb-2">
      <input
        :type="type"
        :id="labelId"
        v-model="editableContent.name"
        required
        class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        :placeholder="placeholder"
      />
      <RemoveButton :icon-only="true" :button-name="'Remove'" class="ml-2" @click="$emit('remove')" />
      <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
      <p v-if="errors" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>
    <AddButton :button-name="'Add Input'" @click="$emit('add')" />
  </div>
</template>