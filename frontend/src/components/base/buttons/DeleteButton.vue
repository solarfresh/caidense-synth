<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';


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
  <button v-if="iconOnly" class="text-red-600 hover:text-red-900 focus:outline-none">
    <TrashIcon class="w-5 h-5 inline-block" />
  </button>
  <button
    v-else
    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
  >
    <TrashIcon class="h-5 w-5 mr-2" /> {{ buttonName }}
  </button>
</template>