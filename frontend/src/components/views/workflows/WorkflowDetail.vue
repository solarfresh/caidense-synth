<script setup lang="ts">
import { apiService } from '@/api/apiService';
import FlowBackground from '@/components/layouts/flow/FlowBackground.vue';
import StartEventNode from '@/components/layouts/flow/StartEventNode.vue';
import EndEventNode from '@/components/layouts/flow/EndEventNode.vue';
import FormModal from '@/components/layouts/form/FormModal.vue';
import Container from '@/components/shared/Container.vue';
import { useBlocktStore } from '@/stores/block';
import { useWorkflowStore } from '@/stores/workflow';
import type { Block } from '@/types/blocks';
import { ExecutionEdge, ExecutionNodeType, Thinking, Workflow } from '@/types/workflow';
import { Edge, Node, useVueFlow, VueFlow } from '@vue-flow/core';
import { ObjectId } from 'bson';
import { computed, markRaw, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import WorkflowDetailSidebar from './WorkflowDetailSidebar.vue';
import WorkflowNodeFormData from './WorkflowNodeFormData.vue';


const { onConnect, addEdges, addNodes, screenToFlowCoordinate, onNodeDoubleClick, onNodeDrag, onNodesInitialized, updateNode } = useVueFlow();
const route = useRoute();
const store = {
  block: useBlocktStore(),
  workflow: useWorkflowStore()
};

const blocks = ref<Array<Block> | null>(null);
const draggedType = ref<string | null>(null);
const isDragOver = ref(false);
const isDragging = ref(false);
const isEditNode = ref(false);
const edges = ref<Edge[]>([]);
const nodes = ref<Node[]>([]);
const nodeTypes = {
  endEvent: markRaw(EndEventNode),
  startEvent: markRaw(StartEventNode),
}
const workflow = ref<Workflow | null>(null);

const nodeConfig = ref<Node | null>(null);
const nodeFormData = ref();

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
  fetchBlocks();
  fetchWorkflow();
});

onUnmounted(() => {
  document.removeEventListener('drop', onDragEnd);
});

const fetchBlocks = async () => {
  blocks.value = store.block.getBlocks;

  if (blocks.value.length < 1) {
    const response = await apiService.block.getAll();
    blocks.value = response.data;
    store.block.updateBlocks(blocks.value);
  }
};

const fetchWorkflow = async () => {
  workflow.value = store.workflow.getCurrentWorkflow;

  if (!workflow.value) {
    const workflowId = route.params.id as string;
    const response = await apiService.workflow.get(workflowId);

    workflow.value = response.data;
    store.workflow.currentWorkflowId = workflowId;
    store.workflow.workflows.set(workflowId, workflow.value);
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
          outgoing: node.outgoing,
          outputs: node.outputs,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt
        },
      }
    });

    edges.value = workflow.value.activatedReasoningThinkingId.edges;
  } else {
    nodes.value = [
      {
        id: new ObjectId().toHexString(),
        type: 'startEvent',
        position: {x: 0, y: 0},
        data: { label: 'Start Event' },
      },
      {
        id: new ObjectId().toHexString(),
        type: 'endEvent',
        position: {x: 0, y: 64},
        data: { label: 'End Event' },
      }
    ];
  }
};

const handleSubmit = async () => {
  let response = undefined;
  if (workflow.value?.activatedReasoningThinkingId) {
    response = await apiService.workflow.updateThinking(store.workflow.currentWorkflowId, submitFormData.value);
  } else {
    response = await apiService.workflow.createThinking(store.workflow.currentWorkflowId, submitFormData.value);
  }

  store.workflow.workflows.set(response.data.id, response.data);
};

const handleNodeSubmit = async () => {
  console.log(nodeFormData.value.submitNodeFormData)
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

onNodeDoubleClick((event) => {
  isEditNode.value = true;
  nodeConfig.value = event.node;
});

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
          <WorkflowDetailSidebar :blocks="blocks || []" @dragstart="onDragStart" />
        </div>
        <div class="flex-auto p-6 mx-4 bg-white shadow-md rounded-md">
          <VueFlow :nodes="nodes" :nodeTypes="nodeTypes" :edges="edges" @dragover="onDragOver" @dragleave="onDragLeave">
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
  <FormModal :is-open="isEditNode" :title="'Configure Node'" @close="isEditNode = false" @save="handleNodeSubmit">
    <template #fields>
      <WorkflowNodeFormData :node-config="nodeConfig" :ref="'nodeFormData'" />
    </template>
  </FormModal>
</template>
