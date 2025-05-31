<script setup lang="ts">
import { FormErrors } from '@/types/form';
import { PropType, ref } from 'vue';


const props = defineProps({
  description: {
    type: String,
    default: ''
  },
  errors: {
    type: Object as PropType<FormErrors>,
    default: {name: null}
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  labelId: {
    type: String,
    required: true
  },
  labelName: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true
  }
})

const content = ref(null)
</script>

<template>
  <div class="mb-5">
    <label :for="labelId" class="block text-sm font-medium text-gray-700 mb-2">
      {{ labelName }} <span v-if="isRequired" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :id="labelId"
      v-model="content"
      required
      class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      :placeholder="placeholder"
    />
    <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
  </div>
</template>