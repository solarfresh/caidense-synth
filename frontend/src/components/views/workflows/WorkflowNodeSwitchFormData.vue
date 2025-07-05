<script setup lang="ts">
import CreateButton from '@/components/base/buttons/CreateButton.vue';
import DeleteButton from '@/components/base/buttons/DeleteButton.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import type { FormInstance, FormSelectOption } from '@/types/form';
import type { SwitchCase } from '@/types/workflow';
import { Node, useVueFlow } from '@vue-flow/core';
import { keyBy } from 'lodash';
import { PropType, onMounted, reactive, ref, watch } from 'vue';


const flowStore = useVueFlow();

const props = defineProps({
  nodeConfig: {
    type: Object as PropType<Node | null>,
    required: true
  }
});

const switchType = ref('');
const switchCases = ref<SwitchCase[]>([]);
const outgoingOptions = ref<FormSelectOption[]>([]);
const formInstance = reactive<Map<string, FormInstance>>(new Map());
const formInstanceArray = ref<Map<string, FormInstance>[]>([new Map<string, FormInstance>()]);

const registerRef = async (key:string, instance: any, index: number | null = null) => {
  if (!instance) return;

  if (index === null) {
    formInstance.set(key, instance);
  } else {
    formInstanceArray.value[index].set(key, instance);
  }
}

watch(() => props.nodeConfig?.data.config, (newConfig) => {
  switchType.value = newConfig.script;
  switchCases.value = Object.entries(newConfig.switchCases).map(([key, value]) => {
    return {
      key: key,
      value: value
    } as SwitchCase
  });
  formInstanceArray.value = switchCases.value.map((switchCase) => {
    return new Map<string, FormInstance>();
  });
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
  switchType.value = props.nodeConfig?.data.config.script;
  switchCases.value = Object.entries(props.nodeConfig?.data.config.switchCases).map(([key, value]) => {
    return {
      key: key,
      value: value
    } as SwitchCase
  });
  formInstanceArray.value = switchCases.value.map((_: any) => {
    return new Map<string, FormInstance>();
  });
  outgoingOptions.value = props.nodeConfig?.data.outgoing.map((edgeId: string) => {
    const edge = flowStore.findEdge(edgeId);
    const targetNode = flowStore.findNode(edge?.target);
    return {
      id: edge?.id,
      name: targetNode?.data.label,
    }
  });
});

const addSwitchCases = () => {
  switchCases.value.push({key: '', value: ''});
  formInstanceArray.value.push(new Map<string, FormInstance>());
}

const removeSwitchCase = (index: number) => {
  switchCases.value.splice(index, 1);
}

defineExpose({
  formInstanceArray,
  formInstance
});
</script>

<template>
  <FormInput :label-name="'Switch Type'" :label-id="'switchType'" :content="switchType" :placeholder="'Enter the switch type'" :ref="el => registerRef('switchType', el)" />
  <div v-for="(switchCase, index) in switchCases" class="flex flex-row items-center justify-center sm:w-full space-x-4 mb-2">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
      <FormInput :label-name="'Switch Case'" :label-id="'switchCase'" :content="switchCase.key" :placeholder="'Enter the switch case'" :ref="el => registerRef('switchCase', el, index)" />
      <FormSelect :label-name="'Switch Path'" :label-id="'switchPath'" :content="switchCase.value" :options="outgoingOptions" :ref="el => registerRef('switchPath', el, index)" />
    </div>
    <DeleteButton @click="removeSwitchCase(index)" :buttonName="'Remove Case'" class="inline-flex" />
  </div>
  <CreateButton @click="addSwitchCases" :buttonName="'Add Case'" />
</template>