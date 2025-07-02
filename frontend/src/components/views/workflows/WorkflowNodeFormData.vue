<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormMultiFieldsMultiInput from '@/components/layouts/form/FormMultiFieldsMultiInput.vue';
import FormTextarea from '@/components/layouts/form/FormTextarea.vue';
import { VariableType } from '@/enums/common';
import type { Variable } from '@/types/common';
import type { FormInstance } from '@/types/form';
import { Node } from '@vue-flow/core';
import { PropType, computed, reactive, ref } from 'vue';


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
  script: props.nodeConfig?.data?.script || '',
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
      }
    ]]
  }
})

const submitNodeFormData = computed(() => {
  const updatedNodeData = props.nodeConfig?.data;
  updatedNodeData.label = nodeForm.get('nodeName')?.editableContent;
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
      description: instance.get('outputDescription')?.editableContent
    }
  }).filter(obj => obj.name !== undefined);

  let obj = {
    id: props.nodeConfig?.id,
    type: nodeData.value.type,
    data: updatedNodeData,
  }

  return obj;
});

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
  <FormInput :label-name="'Node Name'" :label-id="'nodeName'" :content="nodeData.label" :placeholder="'Enter node name'" :ref="el => registerRef('nodeName', el)" />
  <FormTextarea v-if="nodeData.type === 'llmCall'" :label-name="'Prompt Template'" :label-id="'nodeScript'" :content="nodeData.promptTemplate" :rows="10" :ref="el => registerRef('promptTemplate', el)" />
  <FormTextarea v-if="nodeData.type === 'script'" :label-name="'Scripts'" :label-id="'nodeScript'" :content="nodeData.script" :placeholder="'Enter a script'" :ref="el => registerRef('script', el)" />
  <FormMultiFieldsMultiInput
    :ref="el => registerRef('inputs', el)"
    :add-button-name="'Add Input'"
    :componentGroup="inputsComponentGroup" />
  <FormMultiFieldsMultiInput
    :ref="el => registerRef('outputs', el)"
    :add-button-name="'Add Output'"
    :componentGroup="outputsComponentGroup" />
</template>