<script setup lang="ts">
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import Container from '@/components/shared/Container.vue';
import { FormInstance } from '@/types/form';
import { computed, reactive, ref } from 'vue';


const isSubmitting = ref(false);
const workflowForm = reactive<Map<string, FormInstance>>(new Map())

const workflowFormData = computed(() => {
  return {
    name: workflowForm.get('name')?.editableContent?.trim(),
    description: workflowForm.get('description')?.editableContent?.trim(),
    tags: workflowForm.get('tags')?.editableContent
        ?.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''),
  }
})

const handleSubmit = async () => {
  console.log('Workflow From Data:', workflowFormData.value);
};

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    workflowForm.set(key, instance)
  }
};

</script>

<template>
  <Container :page-title="'Create New Workflow'">
    <template #content>
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-xl p-8">
        <FormInput :isRequired="true" :labelId="'name'" :labelName="'Workflow Name'" :placeholder="'e.g., Summarize Article and Post to Social Media'" :type="'text'" :ref="(el: any) => registerRef('name', el)" />
        <FormTextarea :isRequired="false" :labelId="'description'" :labelName="'Description'" :placeholder="'Briefly describe what this workflow will do.'" :ref="(el: any) => registerRef('description', el)" />
        <FormInput :description="'Separate tags with commas.'" :isRequired="false" :labelId="'tags'" :labelName="'Categories/Tags (comma-separated)'" :placeholder="'e.g., general, utility, marketing'" :type="'text'" :ref="(el: any) => registerRef('tags', el)" />

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Create Workflow'" :dynamic-button-name="'Creating...'" />
        </div>
      </form>
    </template>
  </Container>
</template>