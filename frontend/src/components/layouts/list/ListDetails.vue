<script setup lang="ts">
import Loading from '@/components/base/Loading.vue';


const props = defineProps({
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
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4">
      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="itemFound" :itemFoundDescription="itemFoundDescription">
        <template #page>
          <slot name="page" />
        </template>
      </Loading>
    </div>
  </div>
</template>