<script setup lang="ts">
import { ListDetailsOverviewItems } from '@/types/list'


const props = defineProps<ListDetailsOverviewItems>()
</script>

<template>
  <div class="flex items-center">
    <component :is="icon" class="h-4 w-4 mr-2 text-gray-500" />
    {{ text }}
  </div>
</template>