<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { RocketLaunchIcon, FolderIcon, CubeIcon } from '@heroicons/vue/24/outline';


const props = defineProps({
  isLogin: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'login'): void;
}>();

</script>

<template>
  <header class="bg-white shadow-md sticky top-0 z-10">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <router-link to="/" class="text-xl font-bold text-indigo-600">
          Caidense Synth
        </router-link>
      </div>

      <div class="hidden sm:flex items-center space-x-4">
        <router-link to="/workflows" class="text-gray-700 hover:text-indigo-600 font-semibold transition duration-150 ease-in-out">
          <RocketLaunchIcon class="w-5 h-5 mr-1 inline-block" />
          Workflows
        </router-link>
        <router-link to="/repositories" class="text-gray-700 hover:text-indigo-600 font-semibold transition duration-150 ease-in-out">
          <FolderIcon class="w-5 h-5 mr-1 inline-block" />
          Prompt Repositories
        </router-link>
        <router-link to="/blocks" class="text-gray-700 hover:text-indigo-600 font-semibold transition duration-150 ease-in-out">
          <CubeIcon class="w-5 h-5 mr-1 inline-block" />
          Block Library
        </router-link>
      </div>

      <div class="hidden sm:flex items-center">
        <button
          v-if="!isLogin"
          @click="$emit('login')"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Log In
        </button>
        <div v-else class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </div>
      </div>
    </nav>
  </header>
</template>