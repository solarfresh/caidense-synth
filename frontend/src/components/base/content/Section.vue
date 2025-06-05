<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4"> {{ title }} </h2>

    <slot name="fields" />
  </section>
</template>