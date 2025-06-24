<script setup lang="ts">
import { apiService } from '@/api/apiService';
import Container from '@/components/shared/Container.vue';
import { useBlocktStore } from '@/stores/block';
import type { Block } from '@/types/blocks';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BlockCard from './BlockCard.vue';


const router = useRouter();
const store = useBlocktStore();

const blocks = ref<Block[]>([]);
const showSidebar = ref<boolean>(false); // Toggle sidebar visibility

onMounted(() => {
  fetchBlocks();
});

const fetchBlocks = async () => {
  const response = await apiService.block.getAll();
  blocks.value = response.data;
  store.updateBlocks(blocks.value);
};

const goToCreateBlock = () => {
  router.push({ name: 'CreateBlock' });
};

const handleEditBlock = (id: string) => {
  console.log('Editing block:', id);
  store.currentBlockId = id;
  router.push({ name: 'EditBlock', params: { id } });
}

const handleDeleteBlock = (id: string) => {
  console.log('Deleting block:', id);
}
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
            <BlockCard
              v-for="block in blocks"
              :key="block.id"
              :block="block"
              @edit="handleEditBlock"
              @delete="handleDeleteBlock"
            />
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>