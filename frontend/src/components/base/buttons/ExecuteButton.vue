<script setup lang="ts">
import { ArrowPathIcon, BoltIcon } from '@heroicons/vue/20/solid';


const props = defineProps({
  isRunning: {
    type: Boolean,
    default: false
  },
  buttonName: {
    type: String,
    required: true
  },
  dynamicButtonName: {
    type: String,
    required: true
  }
});
</script>

<template>
  <button
    type="submit"
    :disabled="isRunning"
    class="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <ArrowPathIcon v-if="isRunning" class="-ml-1 mr-2 h-4 w-4 animate-spin" />
    <BoltIcon v-if="!isRunning" class="-ml-1 mr-2 h-5 w-5" />
    {{ isRunning ? dynamicButtonName : buttonName }}
  </button>
</template>