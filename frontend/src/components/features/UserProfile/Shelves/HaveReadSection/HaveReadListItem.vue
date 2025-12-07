<template>
    <div class="have-read-list-item">
        <div class="book-title">{{ book.title }}</div>
        <div class="book-author">{{ book.author }}</div>
        <div v-if="book.tags?.length" class="book-tags">
            <BookTag
                v-for="tag in book.tags"
                :key="tag"
                :tag="tag"
                :selected="true"
                color="blue"
                :size="mobile ? 'xsmall' : 'small'"
            />
        </div>
        <div v-else class="no-tags">
            <span class="no-tags-text">no tags</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";

defineProps<{
    book: FutureBook;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.have-read-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    align-items: center;
    padding: 0 0.5rem 0.5rem 0.5rem;
    border-bottom: 1px solid var(--accent-green);
    transition: background-color 0.2s ease;
    width: 100%;
}

.have-read-list-item:hover {
    background-color: color-mix(in srgb, var(--accent-green) 8%, transparent);
}

.book-title {
    flex: 1 0 30%;
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
}

.book-author {
    flex: 1 0 30%;
    font-size: 0.9rem;
    color: var(--accent-green);
    text-align: center;
}

.book-tags {
    flex: 1 0 40%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;
}

.no-tags {
    flex: 1 0 40%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-tags-text {
    font-size: 0.85rem;
    color: var(--main-text);
    opacity: 0.5;
    font-style: italic;
    border: 1px dashed var(--accent-blue);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
}

@media (min-width: 768px) {
    .have-read-list-item {
        justify-content: space-evenly;
        gap: 1.5rem;
        padding: 0 0.75rem 0.75rem 0.75rem;
    }

    .book-title {
        font-size: 1.125rem;
    }

    .book-author {
        font-size: 1rem;
    }

    .no-tags {
        font-size: 1rem;
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
