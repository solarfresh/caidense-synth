<script setup lang="ts">
import { DocumentDuplicateIcon } from '@heroicons/vue/20/solid';


const props = defineProps({
  buttonName: {
    type: String,
    required: true
  },
});
</script>

<template>
  <button
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <DocumentDuplicateIcon class="-ml-1 mr-2 h-4 w-4 animate-spin" />
    {{ buttonName }}
  </button>
</template>