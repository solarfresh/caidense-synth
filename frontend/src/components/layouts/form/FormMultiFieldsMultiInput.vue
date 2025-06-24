<script setup lang="ts">
import AddButton from '@/components/base/buttons/AddButton.vue';
import RemoveButton from '@/components/base/buttons/RemoveButton.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import { FormInstance, FormProps } from '@/types/form';
import { ref, shallowRef } from 'vue';


const props = defineProps({
  addButtonName: {
    type: String,
    default: ''
  },
  componentInfo: {
    type: Array<{name: string; props: FormProps;}>,
    required: true,
  }
});

const componentIndexes = ref([1]);

const components = shallowRef(new Map([
  ['input', FormInput],
  ['select', FormSelect],
]))

const formInstanceArray = ref<[Map<string, FormInstance>]>([new Map()]);

defineExpose({
  formInstanceArray
});

const addComponent = async () => {
  formInstanceArray.value.push(new Map());
};

const registerRef = async (componentMap: Map<string, FormInstance>, key:string, instance: any) => {
  if (instance) {
    componentMap.set(key, instance);
  }
}

const removeComponent = async (index: number) => {
  formInstanceArray.value.splice(index, 1);
};
</script>

<template>
  <div class="space-y-4">
    <div v-for="(componentMap, index) in formInstanceArray" class="flex flex-row items-center justify-center sm:w-full space-x-4 mb-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        <component v-for="info in componentInfo" :is="components.get(info.name)" v-bind="info.props" :ref="el => registerRef(componentMap, info.props.labelId, el)" />
      </div>
      <RemoveButton :icon-only="true" :button-name="'Remove'" class="inline-flex" @click="removeComponent(index)" />
    </div>
    <AddButton :button-name="addButtonName" @click="addComponent" />
  </div>
</template>