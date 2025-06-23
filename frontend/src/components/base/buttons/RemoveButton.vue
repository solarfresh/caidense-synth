<script setup lang="ts">
import { MinusIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  buttonName: {
    type: String,
    required: true
  },
  iconOnly: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button v-if="iconOnly" class="inline-flex items-center p-1 rounded-full bg-red-100 text-red-600 hover:text-red-900 focus:outline-none">
    <MinusIcon class="w-5 h-5 inline-block" />
  </button>
  <button
    v-else
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    <MinusIcon class="h-5 w-5 mr-2" /> {{ buttonName }}
  </button>
</template>