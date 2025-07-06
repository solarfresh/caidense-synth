<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: 'text-gray-500'
  },
  highLightClass: {
    type: String,
    defaul: ''
  }
});
</script>

<template>
  <td v-if="highLightClass" :class="['px-6 py-4 whitespace-nowrap text-sm', customClass]">
    <span :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', highLightClass
    ]">
      {{ content }}
    </span>
  </td>
  <td v-else :class="['px-6 py-4 whitespace-nowrap text-sm', customClass]">
    {{ content }}
  </td>
</template>