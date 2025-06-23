<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormMultiInputs from '@/components/layouts/form/FormMultiInputs.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { Node } from '@vue-flow/core';
import { PropType, ref } from 'vue';


const props = defineProps({
  nodeConfig: {
    type: Object as PropType<Node | null>,
    required: true
  }
})

const nodeData = ref({
  label: props.nodeConfig?.data.label || '',
  inputs: props.nodeConfig?.data.inputs || [],
  outputs: props.nodeConfig?.data.outputs || [],
  promptTemplate: props.nodeConfig?.data.config?.promptTemplate || '',
  script: props.nodeConfig?.data?.script || '',
  type: props.nodeConfig?.type || '',
});
</script>

<template>
  <FormInput :label-name="'Node Name'" :label-id="'nodeName'" :content="nodeData.label" :placeholder="'Enter node name'" />
  <FormTextarea v-if="nodeData.type === 'llmCall'" :label-name="'Prompt Template'" :label-id="'nodeScript'" :content="nodeData.promptTemplate" :rows="10" />
  <FormTextarea v-if="nodeData.type === 'script'" :label-name="'Scripts'" :label-id="'nodeScript'" :content="nodeData.script" :placeholder="'Enter a script'" />
  <FormMultiInputs :label-name="'Inputs'" :label-id="'nodeInputs'" :content="nodeData.inputs" :placeholder="'Input name'" />
  <FormMultiInputs :label-name="'Outputs'" :label-id="'nodeOutputs'" :content="nodeData.outputs" :placeholder="'Output name'" />
</template>