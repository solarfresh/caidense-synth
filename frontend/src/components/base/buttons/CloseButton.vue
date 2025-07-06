<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <button
    type="button"
    class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    <span class="sr-only">Close</span>
    <XMarkIcon class="h-5 w-5" aria-hidden="true" />
  </button>
</template>