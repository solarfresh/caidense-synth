<script setup lang="ts">
import { FormProps } from '@/types/form';


const props = defineProps<FormProps>();
</script>

<template>
  <label class="inline-flex items-center">
    <input
      type="checkbox"
      class="form-checkbox h-5 w-5 text-blue-600 rounded"
    />
    <span class="ml-2 text-gray-700">
      {{ labelName }}
    </span>
  </label>
</template>