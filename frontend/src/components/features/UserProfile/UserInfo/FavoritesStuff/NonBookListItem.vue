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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.non-book-list-item:hover {
    background-color: var(--accent-lavender);
    color: var(--background-color);
    border-color: var(--accent-lavender);
    transform: translateY(-2px);
    box-shadow:
        0 4px 12px rgba(179, 136, 255, 0.4),
        0 0 20px rgba(179, 136, 255, 0.2);
}

.non-book-list-item:active {
    transform: translateY(0);
    box-shadow:
        0 2px 8px rgba(179, 136, 255, 0.3),
        0 0 15px rgba(179, 136, 255, 0.15);
}

@media (max-width: 768px) {
    .non-book-list-item {
        font-size: 0.875rem;
        padding: 0.33rem 0.5rem;
    }
}
</style>
