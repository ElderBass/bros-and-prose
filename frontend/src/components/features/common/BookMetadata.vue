<template>
    <div class="author-and-meta">
        <p class="author">{{ author }}</p>
        <span v-if="yearPublished" class="separator">|</span>
        <p v-if="yearPublished" class="meta">
            {{ yearPublished }}
        </p>
        <span v-if="pages" class="separator">|</span>
        <p v-if="pages" class="meta">{{ pages }} pages</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    author: string;
    yearPublished?: number | string;
    pages?: number;
}>();
</script>

<style scoped>
.author-and-meta {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    opacity: 0.85;
    flex-wrap: wrap;
}

.author {
    margin: 0;
    color: var(--accent-blue);
}

.separator {
    color: var(--accent-blue);
    font-weight: 600;
    opacity: 0.6;
}

.meta {
    margin: 0;
    color: var(--main-text);
}

@media (min-width: 768px) {
    .author-and-meta {
        font-size: 1.25rem;
    }
}
</style>
