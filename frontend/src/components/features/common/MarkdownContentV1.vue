<template>
    <div class="markdown-content" v-html="safeHtml"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdownToSafeHtml } from "@/utils/markdownUtilsV1";

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

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
    color: var(--accent-blue);
    margin: 0.6rem 0 0.35rem;
    line-height: 1.25;
}

.markdown-content :deep(p) {
    margin: 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
    margin: 0.35rem 0 0.45rem 1.3rem;
    padding: 0;
}

.markdown-content :deep(li) {
    margin: 0.2rem 0;
}

.markdown-content :deep(blockquote) {
    margin: 0.5rem 0;
    border-left: 3px solid var(--accent-lavender);
    padding-left: 0.7rem;
    color: var(--main-text);
    opacity: 0.9;
}

.markdown-content :deep(code) {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.3rem;
    padding: 0.02rem 0.35rem;
    font-size: 0.92em;
}

.markdown-content :deep(a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
}

.markdown-content :deep(a:hover) {
    color: var(--accent-lavender);
}
</style>
