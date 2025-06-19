<script setup lang="ts">
import FlowBackground from '@/components/layouts/flow/FlowBackground.vue';
import Container from '@/components/shared/Container.vue';
import { useWorkflowStore } from '@/stores/workflow';
import type { Workflow } from '@/types/workflow';
import { useVueFlow, VueFlow } from '@vue-flow/core';
import { ObjectId } from 'bson';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import WorkflowDetailSidebar from './WorkflowDetailSidebar.vue';
import { apiService } from '@/api/apiService';


const { onConnect, addEdges, addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow();
const route = useRoute();
const store = useWorkflowStore();

const draggedType = ref<string | null>(null);
const isDragOver = ref(false);
const isDragging = ref(false);
const nodes = ref([])
const workflow = ref<Workflow | null>(null);

watch(isDragging, (dragging) => {
  document.body.style.userSelect = dragging ? 'none' : ''
})

onMounted(() => {
  fetchWorkflow();
});

onUnmounted(() => {
  document.removeEventListener('drop', onDragEnd);
});

const fetchWorkflow = async () => {
  workflow.value = store.getCurrentWorkflow;

  if (!workflow.value) {
    const workflowId = route.params.id as string;
    const response = await apiService.workflow.get(workflowId);

    workflow.value = response.data;
    store.currentWorkflowId = workflowId;
    store.workflows.set(workflowId, workflow.value);
  }
};

const onDragStart = (event: DragEvent, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  draggedType.value = type
  isDragging.value = true

  document.addEventListener('drop', onDragEnd)
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()

  if (draggedType.value) {
    isDragOver.value = true

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDragEnd = () => {
  isDragging.value = false
  isDragOver.value = false
  draggedType.value = null
  document.removeEventListener('drop', onDragEnd);
}

const onDrop = (event: DragEvent) => {
  const nodeId = new ObjectId().toHexString();

  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  })

  const newNode = {
    id: nodeId,
    type: draggedType.value || undefined,
    position,
    data: { label: nodeId },
  }

  /**
   * Align node position after drop, so it's centered to the mouse
   *
   * We can hook into events even in a callback, and we can remove the event listener after it's been called.
   */
  const { off } = onNodesInitialized(() => {
    updateNode(nodeId, (node) => ({
      position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
    }))

    off();
  })

  addNodes(newNode);
}

onConnect(addEdges)
</script>

<template>
  <Container
    :page-title="workflow?.name"
  >
    <template #content>
      <div class="flex h-screen" @drop="onDrop">
        <div class="flex-none p-6 mx-4 bg-white shadow-md rounded-md">
          <WorkflowDetailSidebar @dragstart="onDragStart" />
        </div>
        <div class="flex-auto p-6 mx-4 bg-white shadow-md rounded-md">
          <VueFlow :nodes="nodes" @dragover="onDragOver" @dragleave="onDragLeave">
            <FlowBackground
              :style="{
                backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
                transition: 'background-color 0.2s ease',
              }"
            >
              <p v-if="isDragOver">Drop here</p>
            </FlowBackground>
          </VueFlow>
        </div>
      </div>
    </template>
  </Container>
</template>
