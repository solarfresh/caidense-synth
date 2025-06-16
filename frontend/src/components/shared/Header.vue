<script setup>
import { RouterLink } from 'vue-router';
import { RocketLaunchIcon, FolderIcon, CubeIcon } from '@heroicons/vue/24/outline';
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
      </div>

      <div class="sm:hidden">
        <button class="text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  </header>
</template>
