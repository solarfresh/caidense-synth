<script setup lang="ts">
import { EyeIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  buttonName: {
    type: String,
    default: ''
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button v-if="iconOnly" class="text-gray-500 hover:text-gray-900 focus:outline-none">
    <EyeIcon class="w-5 h-5 inline-block" />
  </button>
  <button
    v-else
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <EyeIcon class="h-5 w-5 mr-2" /> {{ buttonName }}
  </button>
</template>