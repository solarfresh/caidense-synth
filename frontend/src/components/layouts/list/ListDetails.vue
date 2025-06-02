<script setup lang="ts">
import Loading from '@/components/base/Loading.vue';
import ListDetailsItems from '@/components/layouts/list/ListDetailsItems.vue'
import { ListDetailsItems as ListDetailsItemsType } from '@/types/list';
import { computed } from 'vue'


const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingDescription: {
    type: String,
    default: ''
  },
  items: {
    type: Array<ListDetailsItemsType>,
    default: []
  },
  itemFoundDescription: {
    type: String,
    default: ''
  },
  itemName: {
    type: String,
    required: true
  }
})
const emits = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'test', id: string): void;
  (e: 'view', id: string): void;
}>();

const itemFound = computed(() => {
  return props.items.length > 0;
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4">
      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="itemFound" :itemFoundDescription="itemFoundDescription">
        <template #page>
          <slot name='page' />
          <ListDetailsItems
            :items="items"
            :itemName="itemName"
            @view="itemId => $emit('view', itemId)"
            @edit="itemId => $emit('edit', itemId)"
            @test="itemId => $emit('test', itemId)"
            @delete="itemId => $emit('delete', itemId)"
          />
        </template>
      </Loading>
    </div>
  </div>
</template>