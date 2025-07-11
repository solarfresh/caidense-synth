<script setup lang="ts">
import { apiService } from '@/api/apiService';
import CancelButton from '@/components/base/buttons/CancelButton.vue';
import SubmitButton from '@/components/base/buttons/SubmitButton.vue';
import FormMultiFields from '@/components/layouts/form/FormMultiFields.vue';
import FormMultiFieldsMultiInput from '@/components/layouts/form/FormMultiFieldsMultiInput.vue';
import FormSection from '@/components/layouts/form/FormSection.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import Container from '@/components/shared/Container.vue';
import { useBlocktStore } from '@/stores/block';
import type { Block } from '@/types/blocks';
import type { FormInstance } from '@/types/form';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();
const store = useBlocktStore();

const block = ref<Block | null>(null);
const blockForm = reactive<Map<string, FormInstance>>(new Map());
const blockId = ref<string>(route.params.id as string);
const isSubmitting = ref<boolean>(false);

const submitFormData = computed(() => {
  const basicInfo = blockForm.get('basicInfo');
  const config = blockForm.get('config');

  const configMap = new Map();
  config?.formInstanceArray?.map(formInstance => {
    configMap.set(
      formInstance.get('configKey')?.editableContent,
      formInstance.get('configDefaultValue')?.editableContent
    )
  })

  return {
    name: basicInfo?.formInstance?.get('blockName')?.editableContent || '',
    description: blockForm?.get('blockDescription')?.editableContent || '',
    type: basicInfo?.formInstance?.get('blockType')?.editableContent || '',
    config: Object.fromEntries(configMap.entries())
  }
});

onMounted( async () => {
  if(!blockId.value) {
    blockId.value = store.currentBlockId;
  }

  block.value = store.getBlock;

  if(!block.value) {
    const response = await apiService.block.get(blockId.value);
    block.value = response.data;
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const response = await apiService.block.update(blockId.value, submitFormData.value);

    router.push({ name: 'BlockOverview' });
  } catch (error) {
    console.error('Error creating block:', error);
    alert('Failed to create block. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    blockForm.set(key, instance)
  }
}
</script>

<template>
  <Container :page-title="'Edit Block'">
    <template #content>
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-xl p-8">
        <FormSection :title="'Basic Information'">
          <template #fields>
            <FormMultiFields
              :ref="el => registerRef('basicInfo', el)"
              :componentInfo="[
              {
                name: 'input',
                props: {
                  content: block?.name,
                  hasMargin: false,
                  labelId: 'blockName',
                  labelName: 'Block Name',
                  isRequired: true,
                  placeholder: 'e.g., LLM Call',
                  type: 'text'
                }
              },
              {
                name: 'input',
                props: {
                  content: block?.type,
                  hasMargin: false,
                  labelId: 'blockType',
                  labelName: 'Block Type',
                  isRequired: true,
                  placeholder: 'e.g., llmCall',
                  type: 'text'
                }
              }
            ]" />
            <FormTextarea :content="block?.description" :isRequired="false" :labelId="'blockDescription'" :labelName="'Block Description'" :description="'Describe the purpose or functionality of the block.'" :placeholder="'e.g., Invoke a Large Language Model with a prompt template.'" :ref="el => registerRef('blockDescription', el)" />
          </template>
        </FormSection>

        <FormSection :title="'Configuration'">
          <template #fields>
            <FormMultiFieldsMultiInput
              :ref="el => registerRef('config', el)"
              :add-button-name="'Add Config'"
              :componentGroup="Array.from(Object.entries(block?.config || {})).map(([key, value]) => {
                return [
                  {
                    name: 'input',
                    props: {
                      content: key,
                      hasMargin: false,
                      labelId: 'configKey',
                      labelName: 'Key',
                      isRequired: false,
                      placeholder: 'e.g., promptTemplate',
                      type: 'text'
                    }
                  },
                  {
                    name: 'input',
                    props: {
                      content: value,
                      hasMargin: false,
                      labelId: 'configDefaultValue',
                      labelName: 'Default Value',
                      isRequired: false,
                      placeholder: 'e.g., Say hello...',
                      type: 'text'
                    }
                  }
                ]
              })"
            />
          </template>
        </FormSection>

        <div class="flex justify-end space-x-4 mt-8">
          <CancelButton :buttonName="'Cancel'" />
          <SubmitButton :isSubmitting="isSubmitting" :buttonName="'Save Block'" :dynamic-button-name="'Saving...'" />
        </div>
      </form>
    </template>
  </Container>
</template>