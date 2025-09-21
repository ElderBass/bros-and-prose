<template>
    <BaseCard
        :key="book.key"
        :shadow-color="isSelected ? 'fuschia' : 'blue'"
        size="small"
        class="result-card"
        :hoverable="true"
        :handleClick="() => onSelect(book)"
    >
        <div class="result-content">
            <img
                v-if="book.imageSrc"
                :src="book.imageSrc"
                :alt="book.title"
                class="cover"
            />
            <div class="meta">
                <h4 class="title">{{ book.title }}</h4>
                <p class="author">{{ book.author }}</p>
                <p class="year" v-if="book.yearPublished">
                    {{ book.yearPublished }}
                </p>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import type { IBookSearchResult } from "@/types";

withDefaults(
    defineProps<{
        book: IBookSearchResult;
        onSelect: (book: IBookSearchResult) => void;
        isSelected: boolean;
    }>(),
    {
        book: undefined,
        isSelected: false,
    }
);
</script>

<style scoped>
.result-card {
    cursor: pointer;
}

.result-content {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.cover {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 0.25rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.title {
    margin: 0;
    font-size: 1.1rem;
    color: var(--accent-blue);
}

.author,
.year {
    margin: 0;
    opacity: 0.8;
}
</style>
