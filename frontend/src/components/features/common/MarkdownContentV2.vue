<template>
    <div class="markdown-content" v-html="safeHtml"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdownToSafeHtml } from "@/utils";

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

.markdown-content :deep(pre) {
    margin: 0.5rem 0;
    padding: 0.65rem 0.85rem;
    overflow-x: auto;
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.9em;
}

.markdown-content :deep(pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
}

.markdown-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    font-size: 0.95em;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.35rem 0.5rem;
    text-align: left;
}

.markdown-content :deep(th) {
    background: rgba(255, 255, 255, 0.06);
}

.markdown-content :deep(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0.75rem 0;
}

.markdown-content :deep(a) {
    color: var(--accent-fuschia);
    text-decoration: underline;
}

.markdown-content :deep(a:hover) {
    color: var(--accent-lavender);
}
</style>
