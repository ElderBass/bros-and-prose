<template>
    <div class="book-list-item">
        <span class="book-title">{{ item }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    item: string;
}>();
</script>

<style scoped>
.book-list-item {
    border: 1px solid var(--accent-fuschia);
    padding: 0.5rem 1rem;
    color: var(--accent-fuschia);
    border-radius: 1rem;
    background-color: var(--background-color);
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.3;
}
</style>
