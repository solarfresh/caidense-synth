<script setup lang="ts">
import Header from '@/components/shared/Header.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex-col no-scrollbar">
    <Header />
    <RouterView />
  </div>
</template>
