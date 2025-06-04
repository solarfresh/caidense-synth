<script setup lang="ts">
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import EditButton from '@/components/base/buttons/EditButton.vue';
import GoBackButton from '@/components/base/buttons/GoBackButton.vue';
import { ListDetailsOverviewItems as ListDetailsOverviewItemsType } from '@/types/list';
import { TagIcon } from '@heroicons/vue/24/outline';
import ListDetailsOverviewItems from './ListDetailsOverviewItems.vue';


const props = defineProps({
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
  listDetailsOverviewInfo: {
    type: Array<ListDetailsOverviewItemsType>,
    default: []
  },
  listDetailsOverviewTags: {
    type: Array<string>,
    default: []
  },
  editButtonName: {
    type: String,
    default: ''
  },
  deleteButtonName: {
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
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
    <GoBackButton v-if="goBackButtonName" :button-name="goBackButtonName" :go-back-router-name="goBackRouterName" />

    <h1 class="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">
      {{ listDetailsName }}
    </h1>
    <div class="flex space-x-3">
      <EditButton v-if="editButtonName" :button-name="editButtonName" @click="$emit('edit')" />
      <DeleteButton v-if="deleteButtonName" :button-name="deleteButtonName" @click="$emit('delete')" />
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
    <p class="text-gray-700 text-lg mb-4">{{ listDetailsDescription }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 text-sm text-gray-600">
      <ListDetailsOverviewItems v-for="info in listDetailsOverviewInfo" :icon="info.icon" :text="info.text" />
      <div v-if="isShowTags" class="flex items-center col-span-1 md:col-span-2">
        <TagIcon class="h-4 w-4 mr-2 text-gray-500" />
        Tags:
        <div class="flex flex-wrap gap-2 ml-2">
          <span
            v-for="tag in listDetailsOverviewTags"
            :key="tag"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ tag }}
          </span>
          <span v-if="listDetailsOverviewTags.length === 0" class="text-gray-500 italic">No tags</span>
        </div>
      </div>
    </div>
  </div>
</template>