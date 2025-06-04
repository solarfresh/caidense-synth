<script setup lang="ts">
import Loading from '@/components/base/common/Loading.vue';
import { DetailsOverviewItemsType } from '@/types/details';
import { computed } from 'vue';
import DetailsOverview from './DetailsOverview.vue';


const props = defineProps({
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
  detailsId: {
    type: String,
    required: true
  },
  detailsName: {
    type: String,
    required: true
  },
  detailsDescription: {
    type: String,
    default: ''
  },
  detailsFoundDescription: {
    type: String,
    default: ''
  },
  detailsInfo: {
    type: Array<DetailsOverviewItemsType>,
    default: []
  },
  detailsTags: {
    type: Array<string>,
    default: []
  },
  loadingDescription: {
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
}>();

const detailsFound = computed(() => {
  return props.detailsId !== '';
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4">
      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="detailsFound" :itemFoundDescription="detailsFoundDescription">
        <template #page>
          <DetailsOverview
            :delete-button-name="deleteButtonName"
            :edit-button-name="editButtonName"
            :is-show-tags="isShowTags"
            :details-id="detailsId"
            :details-name="detailsName"
            :details-description="detailsDescription"
            :details-overview-info="detailsInfo"
            :details-overview-tags="detailsTags"
            :go-back-button-name="goBackButtonName"
            :go-back-router-name="goBackRouterName"
            @edit="$emit('editDetails')"
            @delete="$emit('deleteDetails')"
          />

          <slot name="content" />
        </template>
      </Loading>
    </div>
  </div>
</template>