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

const conditionStatement = ref('');
const truePathEdgeId = ref('');
const falsePathEdigeId = ref('');
const outgoingOptions = ref<FormSelectOption[]>([]);
const formInstance = reactive<Map<string, FormInstance>>(new Map());

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}

watch(() => props.nodeConfig?.data.script, (newScript) => {
  conditionStatement.value = newScript;
});

watch(() => props.nodeConfig?.data.outgoing, (newOutgoing) => {
  outgoingOptions.value = newOutgoing.map((edgeId: string) => {
    const edge = flowStore.findEdge(edgeId);
    const targetNode = flowStore.findNode(edge?.target);
    return {
      id: edge?.id,
      name: targetNode?.data.label,
    }
  });
});

onMounted(() => {
  conditionStatement.value = props.nodeConfig?.data.script;
  outgoingOptions.value = props.nodeConfig?.data.outgoing.map((edgeId: string) => {
    const edge = flowStore.findEdge(edgeId);
    const targetNode = flowStore.findNode(edge?.target);
    return {
      id: edge?.id,
      name: targetNode?.data.label,
    }
  });
});

defineExpose({
  formInstance
});
</script>

<template>
  <FormTextarea :label-name="'Condition Statement'" :label-id="'conditionStatement'" :content="conditionStatement" :placeholder="'Enter the condition statement'" :ref="el => registerRef('conditionStatement', el)" />
  <FormSelect :label-name="'True Path'" :label-id="'truePath'" :options="outgoingOptions" :ref="el => registerRef('truePath', el)" />
  <FormSelect :label-name="'False Path'" :label-id="'falsePath'" :options="outgoingOptions" :ref="el => registerRef('falsePath', el)" />
</template>