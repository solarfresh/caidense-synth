<script setup lang="ts">
import Container from '@/components/shared/Container.vue';
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
  <Container
    :delete-button-name="deleteButtonName"
    :edit-button-name="editButtonName"
    :isLoading="isLoading"
    :loadingDescription="loadingDescription"
    :itemFound="detailsFound"
    :itemFoundDescription="detailsFoundDescription"
    :go-back-button-name="goBackButtonName"
    :go-back-router-name="goBackRouterName"
    :page-title="detailsName"
    @edit="$emit('editDetails')"
    @delete="$emit('deleteDetails')"
  >
    <template #content>
      <DetailsOverview
        :is-show-tags="isShowTags"
        :details-id="detailsId"
        :details-description="detailsDescription"
        :details-overview-info="detailsInfo"
        :details-overview-tags="detailsTags"
      />

      <slot name="content" />
    </template>
  </Container>
</template>