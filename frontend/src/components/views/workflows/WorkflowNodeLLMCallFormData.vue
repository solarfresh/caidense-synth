<script setup lang="ts">
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import type { FormInstance, FormSelectOption } from '@/types/form';
import { Node, useVueFlow } from '@vue-flow/core';
import { PropType, onMounted, reactive, ref, watch } from 'vue';


const flowStore = useVueFlow();

const props = defineProps({
  nodeConfig: {
    type: Object as PropType<Node | null>,
    required: true
  }
});

const promptTemplate = ref('');
const isInference = ref('');
const formInstance = reactive<Map<string, FormInstance>>(new Map());

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}

watch(() => props.nodeConfig?.data.config, (newConfig) => {
  promptTemplate.value = newConfig.promptTemplate;
  isInference.value = newConfig.isInference;
});

onMounted(() => {
  promptTemplate.value = props.nodeConfig?.data.config.promptTemplate;
  isInference.value = props.nodeConfig?.data.config.isInference;
});

defineExpose({
  formInstance
});
</script>

<template>
  <FormTextarea :label-name="'Prompt Template'" :label-id="'promptTemplate'" :content="promptTemplate" :rows="10" :ref="el => registerRef('promptTemplate', el)" />
</template>