<template>
    <span>
        <span class="book-title">{{ title.toUpperCase() }}</span>
        by
        <span v-if="author" class="book-author">{{ author }}</span>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    author?: string;
}>();
</script>

<style scoped>
.book-title {
    font-weight: 600;
    color: var(--accent-blue);
}

.book-author {
    color: var(--accent-fuschia);
}
</style>
