<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const handleCancel = () => {
  router.back(); // Go back to the previous page
};
</script>

<template>
  <button
    type="button"
    @click="handleCancel"
    class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
  >
    Cancel
  </button>
</template>