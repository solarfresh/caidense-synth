<script setup lang="ts">
import Loading from '@/components/base/Loading.vue';


const props = defineProps({
  title: {
    type: String,
    required: true
  },
  enhancedTitle: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingDescription: {
    type: String,
    default: ''
  },
  itemFound: {
    type: Boolean,
    default: true
  },
  itemFoundDescription: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10">
    <div class="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        {{ title }}
        <!-- <span v-if="enhancedTitle" class="text-indigo-600">{{ enhancedTitle }}</span> -->
      </h1>

      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="itemFound" :itemFoundDescription="itemFoundDescription">
        <template #page>
          <slot name="page" />
        </template>
      </Loading>
    </div>
  </div>
</template>