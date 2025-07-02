<script setup lang="ts">
const props = defineProps({
  contextMenuStyle: {
    type: Object,
    default: {}
  }
});

const emits = defineEmits<{
  (e: 'delete'): void;
}>();
</script>

<template>
  <div class="context-menu" :style="props.contextMenuStyle" @contextmenu.prevent>
    <button @click="$emit('delete')">Delete Edge</button>
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
  z-index: 10;
}
</style>