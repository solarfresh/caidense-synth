<script setup lang="ts">
import FormInput from '@/components/layouts/form/FormInput.vue';
import FormSelect from '@/components/layouts/form/FormSelect.vue';
import { FormProps } from '@/types/form';
import { reactive } from 'vue';


const props = defineProps({
  componentInfo: {
    type: Array<{name: string; props: FormProps;}>,
    required: true,
  }
});
const components = reactive(new Map([
  ['input', FormInput],
  ['select', FormSelect],
]))
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <component v-for="info in componentInfo" :is="components.get(info.name)" v-bind="info.props" />
  </div>
</template>