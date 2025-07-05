<script setup lang="ts">
import { apiService } from '@/api/apiService';
import ContextMenu from '@/components/layouts/flow/ContextMenu.vue';
import EndEventNode from '@/components/layouts/flow/EndEventNode.vue';
import FlowBackground from '@/components/layouts/flow/FlowBackground.vue';
import LLMCallNode from '@/components/layouts/flow/LLMCallNode.vue';
import ScriptNode from '@/components/layouts/flow/ScriptNode.vue';
import StartEventNode from '@/components/layouts/flow/StartEventNode.vue';
import FormModal from '@/components/layouts/form/FormModal.vue';
import Container from '@/components/shared/Container.vue';
import { ExecutionNodeType } from '@/enums/workflow';
import { useBlocktStore } from '@/stores/block';
import { useWorkflowStore } from '@/stores/workflow';
import type { Block, BlockConfig } from '@/types/blocks';
import type { ExecutionNode } from '@/types/workflow';
import { Thinking, Workflow } from '@/types/workflow';
import { Edge, Node, useVueFlow, VueFlow } from '@vue-flow/core';
import { ObjectId } from 'bson';
import { computed, markRaw, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ConditionNode from '../../layouts/flow/ConditionNode.vue';
import WorkflowDetailSidebar from './WorkflowDetailSidebar.vue';
import WorkflowNodeFormData from './WorkflowNodeFormData.vue';
import WorkflowTest from './WorkflowTest.vue';


const flowStore = useVueFlow();
const route = useRoute();
const store = {
  block: useBlocktStore(),
  workflow: useWorkflowStore()
};

const activatedReasoningThinking = ref<Thinking | null>(null);
const blocks = ref<Array<Block> | null>(null);
const connectingNodeId = ref('');
const contextMenuStyle = ref({});
const currentEdgeId = ref('');
const draggedType = ref<string | null>(null);
const draggedConfig = ref<BlockConfig>({});
const isDragOver = ref(false);
const isDragging = ref(false);
const isEditNode = ref(false);
const isTestWorkflow = ref(false);
const isShowContextMenu  = ref(false);
const edges = ref<Edge[]>([]);
const nodes = ref<Node[]>([]);
const nodeTypes = {
  condition: markRaw(ConditionNode),
  llmCall: markRaw(LLMCallNode),
  endEvent: markRaw(EndEventNode),
  script: markRaw(ScriptNode),
  startEvent: markRaw(StartEventNode),
}
const workflow = ref<Workflow | null>(null);

const nodeConfig = ref<Node | null>(null);
const nodeFormData = ref();

const submitFormData = computed(() => {
  let thinking = {} as Thinking;

  if (!activatedReasoningThinking.value) throw new Error("Activated reasoning thinking is not set");

  thinking.name = activatedReasoningThinking.value.name;
  thinking.description = activatedReasoningThinking.value.description;
  thinking.inputs = activatedReasoningThinking.value.inputs;
  thinking.outputs = activatedReasoningThinking.value.outputs;

  thinking.nodes = flowStore.nodes.value.map(node => {
    let obj: ExecutionNode = {
      id: node.id,
      type: node.type as ExecutionNodeType,
      position: node.position,
      label: node.data.label,
    };

    if (node.data.config) {
      obj.config = node.data.config;
    }

    obj.incoming = node.data.incoming?.length ? node.data.incoming : [];
    obj.inputs = node.data.inputs?.length ? node.data.inputs : [];
    obj.outgoing = node.data.outgoing?.length ? node.data.outgoing : [];
    obj.outputs = node.data.outputs?.length ? node.data.outputs : [];

    return obj;
  });

  thinking.edges = flowStore.edges.value.map((edge) => {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target
    }
  });
  thinking.reasoningTemplateId = workflow.value?.id || '';

  return thinking;
});

watch(isDragging, (dragging) => {
  document.body.style.userSelect = dragging ? 'none' : ''
})

onMounted(() => {
  fetchBlocks();
  fetchWorkflow();
  document.addEventListener('click', closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu);
  document.removeEventListener('drop', onDragEnd);
});

const closeContextMenu = () => {
  isShowContextMenu.value = false;
};

const deleteEdge = () => {
  if (currentEdgeId.value) {
    const edge = flowStore.findEdge(currentEdgeId.value);

    if (!edge) return;

    flowStore.updateNode(edge.source, (node) => ({
      data: {
        ...node.data,
        outgoing: node.data.outgoing.filter((edgeId: string) => edgeId !== currentEdgeId.value )
      },
    }))

    flowStore.updateNode(edge.target, (node) => ({
      data: {
        ...node.data,
        incoming: node.data.incoming.filter((edgeId: string) => edgeId !== currentEdgeId.value)
      },
    }))

    flowStore.removeEdges([currentEdgeId.value]);

    isShowContextMenu.value = false;
    currentEdgeId.value = '';
  }
};

const fetchBlocks = async () => {
  blocks.value = store.block.getBlocks.sort((a, b) => a.name.localeCompare(b.name));

  if (blocks.value.length < 1) {
    const response = await apiService.block.getAll();
    blocks.value = response.data.sort((a, b) => a.name.localeCompare(b.name));
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
    activatedReasoningThinking.value = workflow.value.activatedReasoningThinkingId;
    nodes.value = activatedReasoningThinking.value.nodes.map(node => {
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

    edges.value = activatedReasoningThinking.value.edges;
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
    activatedReasoningThinking.value = {
      name: workflow.value?.name || '',
      description: workflow.value?.description || '',
      nodes: [],
      edges: [],
      inputs: [],
      outputs: [],
      reasoningTemplateId: '',
    };
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
  const nodeId = nodeFormData.value.submitNodeFormData.id;

  flowStore.updateNode(nodeId, (node) => ({
    data: nodeFormData.value.submitNodeFormData.data,
  }))

  if (activatedReasoningThinking.value && nodeFormData.value.submitNodeFormData.type === ExecutionNodeType.START_EVENT) {
    activatedReasoningThinking.value.inputs = nodeFormData.value.submitNodeFormData.data.inputs;
  }

  if (activatedReasoningThinking.value && nodeFormData.value.submitNodeFormData.type === ExecutionNodeType.END_EVENT) {
    activatedReasoningThinking.value.outputs = nodeFormData.value.submitNodeFormData.data.outputs;
  }

  isEditNode.value = false;
};

const onDragStart = (event: DragEvent, type: string, config: BlockConfig) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  draggedType.value = type;
  draggedConfig.value = config;
  isDragging.value = true;

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

  const position = flowStore.screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  })

  const newNode = {
    id: nodeId,
    type: draggedType.value || undefined,
    position,
    data: {
      label: nodeId.slice(0, 10),
      config: draggedConfig.value,
      incoming: [],
      inputs: [],
      outgoing: [],
      outputs: [],
    },
  }

  /**
   * Align node position after drop, so it's centered to the mouse
   *
   * We can hook into events even in a callback, and we can remove the event listener after it's been called.
   */
  const { off } = flowStore.onNodesInitialized(() => {
    flowStore.updateNode(nodeId, (node) => ({
      position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
    }))

    off();
  })

  flowStore.addNodes(newNode);
}

const openTestModal = () => {
  isTestWorkflow.value = true;
};

flowStore.onEdgeContextMenu(({ edge, event }) => {
  event.preventDefault();
  currentEdgeId.value = edge.id;
  isShowContextMenu.value = true;
  contextMenuStyle.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  };
});

flowStore.onNodeClick((event) => {
  const node = event.node;

  if (!connectingNodeId.value) {
    // First click: set source node
    connectingNodeId.value = node.id;
  } else if (connectingNodeId.value !== node.id) {
    // Second click: create edge to target node
    const newEdge = {
      id: new ObjectId().toHexString(),
      source: connectingNodeId.value,
      target: node.id,
    };
    flowStore.addEdges(newEdge);

    flowStore.updateNode(connectingNodeId.value, (node) => ({
      data: {...node.data, outgoing: [...node.data.outgoing, newEdge.id]},
    }))

    flowStore.updateNode(node.id, (node) => ({
      data: {...node.data, incoming: [...node.data.incoming, newEdge.id]},
    }))

    connectingNodeId.value = ''; // Reset for next connection
  } else {
    // Clicked the same node twice, reset connection
    connectingNodeId.value = '';
  }
});

flowStore.onNodeDoubleClick((event) => {
  isEditNode.value = true;
  nodeConfig.value = event.node;
});

flowStore.onNodeDrag(({ node, event }) => {
  const index = nodes.value.findIndex(obj => obj.id === node.id);
  if (index !== -1) {
    nodes.value[index].position = node.position;
  };
});

// flowStore.onConnect(flowStore.addEdges)
</script>

<template>
  <Container
    :page-title="workflow?.name"
    :go-back-button-name="'Go Back'"
    :go-back-router-name="'WorkflowOverview'"
    :edit-button-name="'Save'"
    :test-button-name="'Test'"
    :delete-button-name="'Delete'"
    @edit="handleSubmit"
    @test="openTestModal"
  >
    <template #content>
      <div class="flex h-screen" @drop="onDrop">
        <div class="flex-none p-6 mx-4 bg-white shadow-md rounded-md">
          <WorkflowDetailSidebar :blocks="blocks || []" @dragstart="onDragStart" @delete="deleteEdge" />
        </div>
        <div class="flex-auto p-6 mx-4 bg-white shadow-md rounded-md">
          <ContextMenu v-if="isShowContextMenu" :context-menu-style="contextMenuStyle" @delete="deleteEdge" />
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
  <FormModal :is-open="isEditNode" :title="'Configure Node'" :cancel-button-name="'Cancel'" :save-button-name="'Save'" @close="isEditNode = false" @save="handleNodeSubmit">
    <template #fields>
      <WorkflowNodeFormData :node-config="nodeConfig" :ref="'nodeFormData'" />
    </template>
  </FormModal>
  <FormModal :is-open="isTestWorkflow" :title="'Test Workflow'" @close="isTestWorkflow = false">
    <template #fields>
      <WorkflowTest :thinking-id="workflow?.activatedReasoningThinkingId.id || ''" :workflow-inputs="workflow?.activatedReasoningThinkingId.inputs" />
    </template>
  </FormModal>
</template>
