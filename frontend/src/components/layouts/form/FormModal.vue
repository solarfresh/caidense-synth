<script setup lang="ts">
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import CloseButton from '@/components/base/buttons/CloseButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';


const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  cancelButtonName: {
    type: String,
    default: ''
  },
  saveButtonName: {
    type: String,
    default: ''
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
  <div v-if="isOpen" class="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-full p-4 text-center">
      <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:max-w-2x1 sm:w-full sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ title }}
          </h3>
          <CloseButton @click="$emit('close')" />
        </div>

        <slot name="fields" />

        <div class="mt-5 sm:mt-6 space-x-2 flex justify-end">
          <CancelButton v-if="cancelButtonName" @click="$emit('close')" :button-name="cancelButtonName" :is-go-back="false" />
          <SubmitButton v-if="saveButtonName" @click="$emit('save')" :is-submitting="false" :button-name="saveButtonName" :dynamic-button-name="'Saving...'" />
        </div>
      </div>
    </div>
  </div>
</template>