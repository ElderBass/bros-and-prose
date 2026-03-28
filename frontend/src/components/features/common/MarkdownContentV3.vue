<template>
    <div class="markdown-content" v-html="safeHtml"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdownToSafeHtml } from "@/utils/markdownUtilsV3";

const props = withDefaults(
    defineProps<{
        markdown: string;
    }>(),
    {
        markdown: "",
    }
);

const safeHtml = computed(() => renderMarkdownToSafeHtml(props.markdown));
</script>

<style scoped>
.markdown-content {
    color: var(--main-text);
    line-height: 1.6;
    word-break: break-word;
}

.markdown-content :deep(p) {
    margin: 0;
    white-space: pre-wrap;
}

.markdown-content :deep(br) {
    line-height: 1.6;
}

.markdown-content :deep(strong) {
    font-weight: 700;
}

.markdown-content :deep(em) {
    font-style: italic;
}

.markdown-content :deep(a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
}

.markdown-content :deep(a:hover) {
    color: var(--accent-lavender);
}
</style>
