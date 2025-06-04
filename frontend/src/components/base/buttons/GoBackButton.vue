<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  buttonName: {
    type: String,
    required: true
  },
  goBackRouterName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="mb-4 md:mb-0">
    <button
      @click="router.push({ name: goBackRouterName })"
      class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out group"
    >
      <ArrowLeftIcon class="h-5 w-5 mr-1.5 text-indigo-500 group-hover:text-indigo-700" />
      {{ buttonName }}
    </button>
  </div>
</template>