<script setup lang="ts">
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/vue/20/solid';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  enhancedTitle: {
    type: String,
    default: ''
  },
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
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        {{ title }}
        <!-- <span v-if="enhancedTitle" class="text-indigo-600">{{ enhancedTitle }}</span> -->
      </h1>

      <div v-if="isLoading" class="text-center py-10 text-gray-600">
        <ArrowPathIcon class="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-2" />
        <p>{{ loadingDescription }}</p>
      </div>

      <div v-else-if="!itemFound" class="text-center py-10 text-red-600">
        <ExclamationTriangleIcon class="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p>{{ itemFoundDescription }}</p>
        <button @click="router.back()" class="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>

      <slot v-else name="form" />
    </div>
  </div>
</template>