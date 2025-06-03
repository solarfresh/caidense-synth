<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import { FormInstance, FormProps } from '@/types/form';
import { reactive, shallowRef } from 'vue';


const props = defineProps({
  componentInfo: {
    type: Array<{name: string; props: FormProps;}>,
    required: true,
  }
});
const components = shallowRef(new Map([
  ['input', FormInput],
  ['select', FormSelect],
]))
const formInstance = reactive<Map<string, FormInstance>>(new Map());

defineExpose({
  formInstance
});

const registerRef = async (key:string, instance: any) => {
  if (instance) {
    formInstance.set(key, instance)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <component v-for="info in componentInfo" :is="components.get(info.name)" v-bind="info.props" :ref="el => registerRef(info.name, el)" />
  </div>
</template>