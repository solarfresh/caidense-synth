<script setup lang="ts">
import { DetailsOverviewItemsType } from '@/types/details'


const props = defineProps<DetailsOverviewItemsType>()
</script>

<template>
  <div class="flex items-center">
    <component :is="icon" class="h-4 w-4 mr-2 text-gray-500" />
    {{ text }}
  </div>
</template>