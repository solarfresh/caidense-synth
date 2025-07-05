<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormMultiFieldsMultiInput from '@/components/layouts/form/FormMultiFieldsMultiInput.vue';
import FormSection from '@/components/layouts/form/FormSection.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { VariableType } from '@/enums/common';
import { ExecutionNodeType } from '@/enums/workflow';
import type { Variable } from '@/types/common';
import type { FormInstance } from '@/types/form';
import type { SwitchCases, VueFlowNodeData } from '@/types/workflow';
import { Node } from '@vue-flow/core';
import { PropType, computed, reactive, ref } from 'vue';
import WorkflowNodeConditionFormData from './WorkflowNodeConditionFormData.vue';
import WorkflowNodeLLMCallFormData from './WorkflowNodeLLMCallFormData.vue';
import WorkflowNodeSwitchFormData from './WorkflowNodeSwitchFormData.vue';


const props = defineProps({
  nodeConfig: {
    type: Object as PropType<Node | null>,
    required: true
  }
})

const nodeData = ref({
  label: props.nodeConfig?.data.label || '',
  inputs: props.nodeConfig?.data.inputs || [{name: '', type: 'text', description: ''}],
  outputs: props.nodeConfig?.data.outputs || [{name: '', type: 'text', description: ''}],
  promptTemplate: props.nodeConfig?.data.config?.promptTemplate || '',
  config: props.nodeConfig?.data?.config || {},
  type: props.nodeConfig?.type || '',
});
const nodeForm = reactive<Map<string, FormInstance>>(new Map());

const variableTypeArray = computed(() => {
  return Object.values(VariableType).map((variableType, index) => {
    return {
      id: index,
      name: variableType
    }
  })
});

const inputsComponentGroup = computed(() => {
  if (nodeData.value.inputs.length) {
    return nodeData.value.inputs.map((variable: Variable) => {
      return [
      {
        name: 'input',
        props: {
          content: variable.name,
          hasMargin: false,
          labelId: 'inputName',
          labelName: 'Name',
          isRequired: false,
          placeholder: 'e.g., TEXT, TONE',
          type: 'text'
        }
      },
      {
        name: 'select',
        props: {
          content: variableTypeArray.value.findIndex(obj => obj.name.toLocaleLowerCase() === variable.type.toLocaleLowerCase()),
          hasMargin: false,
          labelId: 'inputType',
          labelName: 'Type',
          isRequired: false,
          options: variableTypeArray.value
        }
      },
      {
        name: 'input',
        props: {
          content: variable.description,
          hasMargin: false,
          labelId: 'inputDescription',
          labelName: 'Description',
          isRequired: false,
          placeholder: 'e.g., The article content',
          type: 'text'
        }
      }
    ]})
  } else {
    return [[
      {
        name: 'input',
        props: {
          hasMargin: false,
          labelId: 'inputName',
          labelName: 'Name',
          isRequired: false,
          placeholder: 'e.g., TEXT, TONE',
          type: 'text'
        }
      },
      {
        name: 'select',
        props: {
          content: 0,
          hasMargin: false,
          labelId: 'inputType',
          labelName: 'Type',
          isRequired: false,
          options: variableTypeArray.value
        }
      },
      {
        name: 'input',
        props: {
          hasMargin: false,
          labelId: 'inputDescription',
          labelName: 'Description',
          isRequired: false,
          placeholder: 'e.g., The article content',
          type: 'text'
        }
      }
    ]]
  }
})

const outputsComponentGroup = computed(() => {
  if (nodeData.value.outputs.length) {
    return nodeData.value.outputs.map((variable: Variable) => {
      return [
      {
        name: 'input',
        props: {
          content: variable.name,
          hasMargin: false,
          labelId: 'outputName',
          labelName: 'Name',
          isRequired: false,
          placeholder: 'e.g., TEXT, TONE',
          type: 'text'
        }
      },
      {
        name: 'select',
        props: {
          content: variableTypeArray.value.findIndex(obj => obj.name.toLocaleLowerCase() === variable.type.toLocaleLowerCase()),
          hasMargin: false,
          labelId: 'outputType',
          labelName: 'Type',
          isRequired: false,
          options: variableTypeArray.value
        }
      },
      {
        name: 'input',
        props: {
          content: variable.description,
          hasMargin: false,
          labelId: 'outputDescription',
          labelName: 'Description',
          isRequired: false,
          placeholder: 'e.g., The article content',
          type: 'text'
        }
      },
      {
        name: 'input',
        props: {
          content: variable.systemRef,
          hasMargin: false,
          labelId: 'outputSystemRef',
          labelName: 'System Reference',
          isRequired: false,
          placeholder: 'llmOutput',
          type: 'text'
        }
      }
    ]})
  } else {
    return [[
      {
        name: 'input',
        props: {
          hasMargin: false,
          labelId: 'outputName',
          labelName: 'Name',
          isRequired: false,
          placeholder: 'e.g., TEXT, TONE',
          type: 'text'
        }
      },
      {
        name: 'select',
        props: {
          content: 0,
          hasMargin: false,
          labelId: 'outputType',
          labelName: 'Type',
          isRequired: false,
          options: variableTypeArray.value
        }
      },
      {
        name: 'input',
        props: {
          hasMargin: false,
          labelId: 'outputDescription',
          labelName: 'Description',
          isRequired: false,
          placeholder: 'e.g., The article content',
          type: 'text'
        }
      },
      {
        name: 'input',
        props: {
          hasMargin: false,
          labelId: 'outputSystemRef',
          labelName: 'System Reference',
          isRequired: false,
          placeholder: 'llmOutput',
          type: 'text'
        }
      }
    ]]
  }
})

const submitNodeFormData = computed(() => {
  const updatedNodeData = props.nodeConfig?.data;
  updatedNodeData.label = nodeForm.get('nodeName')?.editableContent;

  if (props.nodeConfig?.type === ExecutionNodeType.CONDITION) {
    updateConditionNodeData(updatedNodeData);
  };

  if (props.nodeConfig?.type === ExecutionNodeType.LLM_CALL) {
    updateLLMCallNodeData(updatedNodeData);
  };

  if (props.nodeConfig?.type === ExecutionNodeType.SCRIPT) {
    updateScriptNodeData(updatedNodeData);
  };

  if (props.nodeConfig?.type === ExecutionNodeType.SWITCH) {
    updateSwitchNodeData(updatedNodeData);
  }

  updatedNodeData.inputs = nodeForm.get('inputs')?.formInstanceArray?.map((instance) => {
    return {
      name: instance.get('inputName')?.editableContent,
      type: variableTypeArray.value[instance.get('inputType')?.editableContent ? Number(instance.get('inputType')?.editableContent) : 0].name.toLowerCase(),
      description: instance.get('inputDescription')?.editableContent
    }
  }).filter(obj => obj.name !== undefined);
  updatedNodeData.outputs = nodeForm.get('outputs')?.formInstanceArray?.map((instance) => {
    return {
      name: instance.get('outputName')?.editableContent,
      type: variableTypeArray.value[instance.get('outputType')?.editableContent ? Number(instance.get('outputType')?.editableContent) : 0].name.toLowerCase(),
      description: instance.get('outputDescription')?.editableContent,
      systemRef: instance.get('outputSystemRef')?.editableContent
    }
  }).filter(obj => obj.name !== undefined);

  let obj = {
    id: props.nodeConfig?.id,
    type: nodeData.value.type,
    data: updatedNodeData,
  }

  return obj;
});

const updateConditionNodeData = (nodeData: VueFlowNodeData) => {
  const conditionNodeForm = nodeForm.get('conditionNodeForm')?.formInstance;
  if (!conditionNodeForm) return;
  nodeData.config.script = conditionNodeForm.get("conditionStatement")?.editableContent as string;
  nodeData.config.truePathEdgeId = conditionNodeForm.get("truePath")?.editableContent as string;
  nodeData.config.falsePathEdgeId = conditionNodeForm.get("falsePath")?.editableContent as string;
};

const updateLLMCallNodeData = (nodeData: VueFlowNodeData) => {
  const llmCallNodeForm = nodeForm.get('llmCallNodeForm')?.formInstance;
  if (!llmCallNodeForm) return;
  nodeData.config.promptTemplate = llmCallNodeForm.get('promptTemplate')?.editableContent as string;
  nodeData.config.isInference = llmCallNodeForm.get('isInference')?.editableContent as boolean;
  nodeData.config.repositoryId = llmCallNodeForm.get('selectRepository')?.editableContent as string;
  nodeData.config.promptTemplateId = llmCallNodeForm.get('selectPromptTemplate')?.editableContent as string;
}

const updateScriptNodeData = (nodeData: VueFlowNodeData) => {
  nodeData.config.script = nodeForm.get('scriptNodeForm')?.editableContent as string;
};

const updateSwitchNodeData = (nodeData: VueFlowNodeData) => {
  const switchNodeForm = nodeForm.get('switchNodeForm')?.formInstance;
  const switchNodeFormArray = nodeForm.get('switchNodeForm')?.formInstanceArray;
  if (!switchNodeForm) return;

  nodeData.config.script = switchNodeForm.get('switchType')?.editableContent as string;
  nodeData.config.switchCases = switchNodeFormArray?.map((formInstance) => {
    return {
      key: formInstance.get('switchCase')?.editableContent,
      value: formInstance.get('switchPath')?.editableContent
    }
  }) as SwitchCases[];
};

defineExpose({
  submitNodeFormData
});

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    nodeForm.set(key, instance)
  }
}
</script>

<template>
  <FormSection :title="'Basic Information'">
    <template #fields>
      <FormInput :label-name="'Node Name'" :label-id="'nodeName'" :content="nodeData.label" :placeholder="'Enter node name'" :ref="el => registerRef('nodeName', el)" />
    </template>
  </FormSection>
  <FormSection :title="'Configuration'">
    <template #fields>
      <WorkflowNodeLLMCallFormData v-if="nodeData.type === ExecutionNodeType.LLM_CALL" :node-config="props.nodeConfig" :ref="el => registerRef('llmCallNodeForm', el)" />
      <FormTextarea v-if="nodeData.type === ExecutionNodeType.SCRIPT" :label-name="'Scripts'" :label-id="'nodeScript'" :content="props.nodeConfig?.data.config.script" :placeholder="'Enter a script'" :ref="el => registerRef('scriptNodeForm', el)" />
      <WorkflowNodeConditionFormData v-if="nodeData.type === ExecutionNodeType.CONDITION" :node-config="props.nodeConfig" :ref="el => registerRef('conditionNodeForm', el)" />
      <WorkflowNodeSwitchFormData v-if="nodeData.type === ExecutionNodeType.SWITCH" :node-config="props.nodeConfig" :ref="el => registerRef('switchNodeForm', el)" />
    </template>
  </FormSection>
  <FormSection :title="'Input Variables'">
    <template #fields>
      <FormMultiFieldsMultiInput
        :ref="el => registerRef('inputs', el)"
        :add-button-name="'Add Input'"
        :componentGroup="inputsComponentGroup" />
    </template>
  </FormSection>
  <FormSection :title="'Output Variables'">
    <template #fields>
      <FormMultiFieldsMultiInput
        :ref="el => registerRef('outputs', el)"
        :add-button-name="'Add Output'"
        :componentGroup="outputsComponentGroup" />
    </template>
  </FormSection>
</template>