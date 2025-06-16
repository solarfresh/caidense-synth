<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  buttonName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <PlusIcon class="h-5 w-5 mr-2" /> {{ buttonName }}
  </button>
</template>