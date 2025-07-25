<script setup lang="ts">
import AddButton from '@/components/base/buttons/AddButton.vue';
import RemoveButton from '@/components/base/buttons/RemoveButton.vue';
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import { FormInstance, FormProps } from '@/types/form';
import { computed, ref, shallowRef, watch } from 'vue';


const props = defineProps({
  addButtonName: {
    type: String,
    default: ''
  },
  componentGroup: {
    type: Array<Array<{name: string; props: FormProps;}>>,
    required: true,
  },
  hasMargin: {
    type: Boolean,
    default: true
  }
});

const components = shallowRef(new Map([
  ['input', FormInput],
  ['select', FormSelect],
]))
const formGroup = ref(props.componentGroup);
const formInstanceArray = ref<Map<string, FormInstance>[]>(formGroup.value.map((info) => {
  return new Map<string, FormInstance>();
}));

const formInfo = computed(() => {
  const copyObj = JSON.parse(JSON.stringify(props.componentGroup[0]));
  return copyObj.map((obj: any) => {
    if (obj.name !== 'select') {
      obj.props.content = ''
    }

    return obj;
  });
});

watch(() => props.componentGroup, (newValue) => {
  formGroup.value = newValue;
  formInstanceArray.value = newValue.map((info) => {
    return new Map<string, FormInstance>();
  })
});

defineExpose({
  formInstanceArray
});

const addComponent = async () => {
  formGroup.value.push(formInfo.value);
  formInstanceArray.value.push(new Map());
};

const registerRef = async (index: number, key:string, instance: any) => {
  if (instance) {
    formInstanceArray.value[index]?.set(key, instance);
  }
}

const removeComponent = async (index: number) => {
  formGroup.value.splice(index, 1);
  formInstanceArray.value.splice(index, 1);
};
</script>

<template>
  <div class="space-y-4" :class="{'mb-5': props.hasMargin}">
    <div v-for="(componentInfo, index) in formGroup" class="flex flex-row items-center justify-center sm:w-full space-x-4 mb-2">
      <div class="grid grid-cols-1 gap-4 flex-grow" :class="{'md:grid-cols-2': componentInfo?.length !== 3, 'md:grid-cols-3': componentInfo?.length === 3}">
        <component v-for="info in componentInfo" :is="components.get(info.name)" v-bind="info.props" :ref="el => registerRef(index, info.props.labelId, el)" />
      </div>
      <RemoveButton :icon-only="true" :button-name="'Remove'" class="inline-flex" @click="removeComponent(index)" />
    </div>
    <AddButton :button-name="addButtonName" @click="addComponent" />
  </div>
</template>