<script setup lang="ts">
import Loading from '@/components/base/Loading.vue';
import ListDetailsItems from '@/components/layouts/list/ListDetailsItems.vue';
import { ListDetailsItems as ListDetailsItemsType, ListDetailsOverviewItems as ListDetailsOverviewItemsType } from '@/types/list';
import { computed } from 'vue';
import ListDetailsOverview from './ListDetailsOverview.vue';


const props = defineProps({
  createButtonName: {
    type: String,
    required: true
  },
  deleteButtonName: {
    type: String,
    default: ''
  },
  editButtonName: {
    type: String,
    default: ''
  },
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
  itemsName: {
    type: String,
    required: true
  },
  itemsTitle: {
    type: String,
    default: ''
  },
  goBackButtonName: {
    type: String,
    default: ''
  },
  goBackRouterName: {
    type: String,
    default: ''
  }
})
const emits = defineEmits<{
  (e: 'createDetails'): void;
  (e: 'editDetails'): void;
  (e: 'deleteDetails'): void;
  (e: 'editItem', id: string): void;
  (e: 'deleteItem', id: string): void;
  (e: 'testItem', id: string): void;
  (e: 'viewItem', id: string): void;
}>();

const detailsFound = computed(() => {
  return props.listDetailsId !== '';
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4">
      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="detailsFound" :itemFoundDescription="itemFoundDescription">
        <template #page>
          <ListDetailsOverview
            :delete-button-name="deleteButtonName"
            :edit-button-name="editButtonName"
            :is-show-tags="isShowTags"
            :list-details-id="listDetailsId"
            :list-details-name="listDetailsName"
            :list-details-description="listDetailsDescription"
            :list-details-overview-info="listDetailsInfo"
            :list-details-overview-tags="listDetailsTags"
            :go-back-button-name="goBackButtonName"
            :go-back-router-name="goBackRouterName"
            @edit="$emit('editDetails')"
            @delete="$emit('deleteDetails')"
          />
          <ListDetailsItems
            :items="items"
            :items-name="itemsName"
            :items-title="itemsTitle"
            :create-button-name="createButtonName"
            :has-test-button="false"
            @create="$emit('createDetails')"
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