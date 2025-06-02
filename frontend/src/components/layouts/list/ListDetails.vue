<script setup lang="ts">
import Loading from '@/components/base/Loading.vue';
import ListDetailsItems from '@/components/layouts/list/ListDetailsItems.vue';
import { ListDetailsItems as ListDetailsItemsType, ListDetailsOverviewItems as ListDetailsOverviewItemsType } from '@/types/list';
import { computed } from 'vue';
import ListDetailsOverview from './ListDetailsOverview.vue';


const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isShowTags: {
    type: Boolean,
    default: true
  },
  listDetailsId: {
    type: String,
    required: true
  },
  listDetailsName: {
    type: String,
    required: true
  },
  listDetailsDescription: {
    type: String,
    default: ''
  },
  listDetailsInfo: {
    type: Array<ListDetailsOverviewItemsType>,
    default: []
  },
  listDetailsTags: {
    type: Array<string>,
    default: []
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
  (e: 'editDetails', id: string): void;
  (e: 'deleteDetails', id: string): void;
  (e: 'editItem', id: string): void;
  (e: 'deleteItem', id: string): void;
  (e: 'testItem', id: string): void;
  (e: 'viewItem', id: string): void;
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
          <ListDetailsOverview
            :is-show-tags="isShowTags"
            :list-details-id="listDetailsId"
            :list-details-name="listDetailsName"
            :list-details-description="listDetailsDescription"
            :list-details-overview-info="listDetailsInfo"
            :list-details-overview-tags="listDetailsTags"
            @edit="itemId => $emit('editDetails', itemId)"
            @delete="itemId => $emit('deleteDetails', itemId)"
          />
          <slot name='page' />
          <ListDetailsItems
            :items="items"
            :itemName="itemName"
            @view="itemId => $emit('viewItem', itemId)"
            @edit="itemId => $emit('editItem', itemId)"
            @test="itemId => $emit('testItem', itemId)"
            @delete="itemId => $emit('deleteItem', itemId)"
          />
        </template>
      </Loading>
    </div>
  </div>
</template>