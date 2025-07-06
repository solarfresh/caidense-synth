<script setup lang="ts">
import type { VueFlowNodeData } from '@/types/workflow';
import { Handle, Position, type NodeProps } from '@vue-flow/core';

// props were passed from the slot using `v-bind="customNodeProps"`
const props = defineProps<NodeProps<VueFlowNodeData>>();
</script>

<template>
  <div :id="id" class="node" style="background-color: #4CAF50">
    <Handle type="target" :position="Position.Left" />
    <div>{{ data?.label || 'Script Node' }}</div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.node {
  border: 1px solid #888;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 50px;
  font-weight: bold;
}
</style>