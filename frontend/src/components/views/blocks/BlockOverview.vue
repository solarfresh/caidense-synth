<script setup lang="ts">
import Container from '@/components/shared/Container.vue';
import type { Block } from '@/types/blocks';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const blocks = ref<Block[]>([]);
const showSidebar = ref<boolean>(false); // Toggle sidebar visibility

const goToCreateBlock = () => {
  router.push({ name: 'CreateBlock' });
};
</script>

<template>
  <Container :page-title="'Block Library'" :create-button-name="'New Block'" @create="goToCreateBlock">
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div :class="{'md:col-span-3': showSidebar, 'md:col-span-4': !showSidebar}">
          <div v-if="blocks.length === 0" class="text-center py-10 text-gray-600">
            <p class="text-lg">No blocks found.</p>
            <p class="text-sm mt-2">Click "New Block" to get started!</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
<!--
            <RepositoryCard
              v-for="repository in filteredRepositories"
              :key="repository.id"
              :repository="repository"
              @edit="handleEditRepository"
              @delete="handleDeleteCollection"
              @view="handleViewCollection"
            />
 -->
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>