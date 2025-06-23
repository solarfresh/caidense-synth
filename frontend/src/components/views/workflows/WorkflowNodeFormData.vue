<script setup lang="ts">
import AddButton from '@/components/base/buttons/AddButton.vue';
import RemoveButton from '@/components/base/buttons/RemoveButton.vue';
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
});
</script>

<template>
  <div class="mb-4">
    <label for="nodeName" class="block text-gray-700 text-sm font-bold mb-2">
      Node Name
    </label>
    <input
      type="text"
      id="nodeName"
      v-model="nodeData.label"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder="Enter node name"
    />
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      Inputs
    </label>
    <div v-for="(input, index) in nodeData.inputs" :key="index" class="flex items-center mb-2">
      <input
        type="text"
        v-model="input.name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        placeholder="Input name"
      />
      <RemoveButton :icon-only="true" :button-name="'Remove'" />
    </div>
    <AddButton :button-name="'Add Input'" />
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      Outputs
    </label>
    <div v-for="(output, index) in nodeData.outputs" :key="index" class="flex items-center mb-2">
      <input
        type="text"
        v-model="output.name"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
        placeholder="Output name"
      />
      <RemoveButton :icon-only="true" :button-name="'Remove'" />
    </div>
    <AddButton :button-name="'Add Output'" />
  </div>
</template>