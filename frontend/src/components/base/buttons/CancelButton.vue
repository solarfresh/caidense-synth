<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  buttonName: {
    type: String,
    required: true
  },
  isGoBack : {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits<{
  (e: 'click'): void;
}>();

const handleCancel = () => {
  if (props.isGoBack) {
    router.back(); // Go back to the previous page
  } else {
    emits('click');
  }
};
</script>

<template>
  <button
    type="button"
    @click="handleCancel"
    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
  >
    {{ buttonName }}
  </button>
</template>