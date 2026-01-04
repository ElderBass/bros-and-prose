<template>
    <a class="non-book-list-item" target="_blank" :href="href">{{ item }}</a>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    item: string;
}>();

const href = computed(() => {
    // this needs to be a url for a goolge search query for the item
    const query = [props.item].filter(Boolean).join(" ");
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});
</script>

<style scoped>
.non-book-list-item {
    border: 1px solid var(--accent-lavender);
    padding: 0.5rem 1rem;
    color: var(--accent-lavender);
    border-radius: 1rem;
    background-color: var(--background-color);
    text-decoration: none;
    font-size: 1rem;
    font-weight: 400;
    font-family: "Crimson Text", serif;
    line-height: 1.3;
}
</style>
