<script setup lang="ts">
import { apiService } from '@/api/apiService';
import FlowBackground from '@/components/layouts/flow/FlowBackground.vue';
import Container from '@/components/shared/Container.vue';
import { useWorkflowStore } from '@/stores/workflow';
import type { ExecutionEdge, Thinking, Workflow } from '@/types/workflow';
import { ExecutionNodeType } from '@/types/workflow';
import { Edge, Node, useVueFlow, VueFlow } from '@vue-flow/core';
import { ObjectId } from 'bson';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import WorkflowDetailSidebar from './WorkflowDetailSidebar.vue';


const { onConnect, addEdges, addNodes, screenToFlowCoordinate, onNodeDrag, onNodesInitialized, updateNode } = useVueFlow();
const route = useRoute();
const store = useWorkflowStore();

const draggedType = ref<string | null>(null);
const isDragOver = ref(false);
const isDragging = ref(false);
const edges = ref<Edge[]>([]);
const nodes = ref<Node[]>([]);
const workflow = ref<Workflow | null>(null);


const submitFormData = computed(() => {
  let thinking = {} as Thinking;
  if(workflow.value?.activatedReasoningThinkingId) {
    thinking.name = workflow.value?.activatedReasoningThinkingId.name;
    thinking.description = workflow.value?.activatedReasoningThinkingId.description;
    thinking.inputs = workflow.value?.activatedReasoningThinkingId.inputs;
    thinking.outputs = workflow.value?.activatedReasoningThinkingId.outputs;
    thinking.status = workflow.value?.activatedReasoningThinkingId.status;
  } else {
    thinking.name = workflow.value?.name || '';
    thinking.description = workflow.value?.description || '';
  }

  thinking.nodes = nodes.value.map(node => {
    return {
      id: node.id,
      type: node.type as ExecutionNodeType,
      position: node.position,
      label: node.data.label,
      config: node.data.config,
      incoming: node.data.incoming,
      inputs: node.data.inputs,
      script: node.data.script,
      outgoing: node.data.outgoing,
      outputs: node.data.outputs,
      createdAt: node.data.createdAt,
      updatedAt: node.data.updatedAt
    }
  });
  thinking.edges = edges.value as ExecutionEdge[];

  return thinking;
});

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

  if (workflow.value.activatedReasoningThinkingId) {
    nodes.value = workflow.value.activatedReasoningThinkingId.nodes.map(node => {
      return {
        id: node.id,
        type: node.type,
        position: node?.position || {x: 0, y: 0},
        data: {
          label: node.label,
          config: node.config,
          incoming: node.incoming,
          inputs: node.inputs,
          script: node.script,
          outgoing: node.outgoing,
          outputs: node.outputs,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt
        },
      }
    });

    edges.value = workflow.value.activatedReasoningThinkingId.edges;
  }
};

const handleSubmit = async () => {
  let response = undefined;
  if (workflow.value?.activatedReasoningThinkingId) {
    response = await apiService.workflow.updateThinking(store.currentWorkflowId, submitFormData.value);
  } else {
    response = await apiService.workflow.createThinking(store.currentWorkflowId, submitFormData.value);
  }

  store.workflows.set(response.data.id, response.data);
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
  console.log(event);
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


onNodeDrag(({ node, event }) => {
  const index = nodes.value.findIndex(obj => obj.id === node.id);
  if (index !== -1) {
    nodes.value[index].position = node.position;
  };
});

onConnect(addEdges)
</script>

<template>
  <Container
    :page-title="workflow?.name"
    :go-back-button-name="'Go Back'"
    :go-back-router-name="'WorkflowOverview'"
    :edit-button-name="'Save Workflow'"
    :delete-button-name="'Delete Workflow'"
    @edit="handleSubmit"
  >
    <template #content>
      <div class="flex h-screen" @drop="onDrop">
        <div class="flex-none p-6 mx-4 bg-white shadow-md rounded-md">
          <WorkflowDetailSidebar @dragstart="onDragStart" />
        </div>
        <div class="flex-auto p-6 mx-4 bg-white shadow-md rounded-md">
          <VueFlow :nodes="nodes" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave">
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
