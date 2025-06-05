<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { Ref, ref, watch } from 'vue';


const renderedMarkdown: Ref = ref('');

const props = defineProps({
  markdownText: {
    type: String,
    default: ''
  }
})

watch(() => props.markdownText, (newValue) => {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
  });
  renderedMarkdown.value = md.render(newValue);
}, {immediate: true});
</script>

<template>
  <div class="prose-ul:list-disc prose-ul:px-4 prose-p:py-2 max-w-none">
      <div v-html="renderedMarkdown"></div>
  </div>
</template>