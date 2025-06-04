<script setup lang="ts">
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { useRouter } from 'vue-router';


const router = useRouter();

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingDescription: {
    type: String,
    default: ''
  },
  itemFound: {
    type: Boolean,
    default: true
  },
  itemFoundDescription: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div v-if="isLoading" class="text-center py-10 text-gray-600">
    <ArrowPathIcon class="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-2" />
    <p>{{ loadingDescription }}</p>
  </div>

  <div v-else-if="!itemFound" class="text-center py-10 text-red-600">
    <ExclamationTriangleIcon class="h-8 w-8 text-red-500 mx-auto mb-2" />
    <p>{{ itemFoundDescription }}</p>
    <button @click="router.back()" class="mt-4 text-indigo-600 hover:underline">Go Back</button>
  </div>

  <slot v-else name="page" />
</template>