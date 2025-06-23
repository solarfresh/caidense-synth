<script setup lang="ts">
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import CloseButton from '@/components/base/buttons/CloseButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';


const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  }
})

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
}>();
</script>

<template>
  <div v-if="true" class="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div v-if="true" class="fixed z-50 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-full p-4 text-center">
      <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ title }}
          </h3>
          <CloseButton @click="$emit('close')" />
        </div>

        <slot name="fields" />

        <div class="mt-5 sm:mt-6 space-x-2 flex justify-end">
          <CancelButton @click="$emit('close')" :button-name="'Cancel'" />
          <SubmitButton @click="$emit('save')" :is-submitting="false" :button-name="'Save Configuration'" :dynamic-button-name="'Saving...'" />
        </div>
      </div>
    </div>
  </div>
</template>