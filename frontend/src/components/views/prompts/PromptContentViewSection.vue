<script setup lang="ts">
import DetailsSection from '@/components/layouts/detail/DetailsSection.vue';
import { usePromptStore } from '@/stores/prompt';


const store = usePromptStore();

const parsePromptContent = () => {
  const content: string = store.getPrompt?.promptText || '';

  const parts = [];
  const regex = /(\{[A-Z0-9_]+\})/g; // Matches {PARAM_NAME}
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the parameter
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
    }
    // Add the parameter itself
    parts.push({ type: 'param', value: match[1].slice(1, -1) }); // Remove [] for display
    lastIndex = regex.lastIndex;
  }
  // Add any remaining text after the last parameter
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.substring(lastIndex) });
  }
  return parts;
};
</script>

<template>
  <DetailsSection :title="'Prompt Content'">
    <template #fields>
      <div class="bg-gray-50 font-mono p-4 rounded-md text-sm whitespace-pre-wrap break-words border border-gray-200">
        <span v-for="(part, index) in parsePromptContent()" :key="index">
          <span v-if="part.type === 'text'">{{ part.value }}</span>
          <span v-else class="text-indigo-600 font-semibold bg-indigo-100 px-1 py-0.5 rounded-sm">{{ `\{${part.value}\}` }}</span>
        </span>
      </div>
    </template>
  </DetailsSection>
</template>