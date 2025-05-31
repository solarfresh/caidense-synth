<script setup lang="ts">
import { ref } from 'vue'


const props = defineProps({
  title: {
    type: String,
    required: true
  },
  enhancedTitle: {
    type: String,
    default: ''
  }
});

const title = ref(props.title)
const enhancedTitle = ref(props.enhancedTitle)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        {{ title }}<span v-if="enhancedTitle" class="text-indigo-600">{{ enhancedTitle }}</span>
      </h1>
      <slot name="form" />
    </div>
  </div>
</template>