<script setup lang="ts">
import Loading from '@/components/base/content/Loading.vue';
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import DuplicateButton from '@/components/base/buttons/DuplicateButton.vue';
import EditButton from '@/components/base/buttons/EditButton.vue';
import GoBackButton from '@/components/base/buttons/GoBackButton.vue';
import CreateButton from '../base/buttons/CreateButton.vue';
import TestButton from '@/components/base/buttons/TestButton.vue';


const props = defineProps({
  createButtonName: {
    type: String,
    default: ''
  },
  editButtonName: {
    type: String,
    default: ''
  },
  deleteButtonName: {
    type: String,
    default: ''
  },
  duplicateButtonName: {
    type: String,
    default: ''
  },
  testButtonName: {
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
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingDescription: {
    type: String,
    default: ''
  },
  itemFound: {
    type: Boolean,
    default: true
  },
  itemFoundDescription: {
    type: String,
    default: ''
  },
  pageTitle: {
    type: String,
    default: ''
  }
})

const emits = defineEmits<{
  (e: 'create'): void;
  (e: 'delete'): void;
  (e: 'duplicate'): void;
  (e: 'edit'): void;
  (e: 'test'): void;
}>();

</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex-grow container mx-auto px-4 py-8">
      <Loading :isLoading="isLoading" :loadingDescription="loadingDescription" :itemFound="itemFound" :itemFoundDescription="itemFoundDescription">
        <template #page>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <GoBackButton v-if="goBackButtonName" :button-name="goBackButtonName" :go-back-router-name="goBackRouterName" />

            <h1 class="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">
              {{ pageTitle }}
            </h1>
            <div class="flex space-x-3">
              <CreateButton v-if="createButtonName" :button-name="createButtonName" @click="$emit('create')" />
              <EditButton v-if="editButtonName" :button-name="editButtonName" @click="$emit('edit')" />
              <TestButton v-if="testButtonName" :button-name="testButtonName" @click="$emit('test')" />
              <DuplicateButton v-if="duplicateButtonName" :button-name="duplicateButtonName" @click="$emit('duplicate')" />
              <DeleteButton v-if="deleteButtonName" :button-name="deleteButtonName" @click="$emit('delete')" />
            </div>
          </div>

          <slot name="content" />
        </template>
      </Loading>
    </div>
  </div>
</template>