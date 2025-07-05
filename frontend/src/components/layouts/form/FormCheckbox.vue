<script setup lang="ts">
import { FormProps } from '@/types/form';
import { ref, watch } from 'vue';


const props = defineProps<FormProps>();
const editableContent = ref(props.content);

watch(() => props.content, (newValue) => {
  editableContent.value = newValue;
});

defineExpose({
  editableContent
});
</script>

<template>
  <label class="inline-flex items-center">
    <input
      :id="labelId"
      type="checkbox"
      v-model="editableContent"
      class="h-5 w-5 text-blue-600 border border-gray-300 rounded-md shadow-sm"
    />
    <span class="ml-2 text-sm text-gray-700">
      {{ labelName }}
    </span>
  </label>
</template>