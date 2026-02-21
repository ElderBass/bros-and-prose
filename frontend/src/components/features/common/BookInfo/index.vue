<template>
    <div v-if="book" class="book-info-content">
        <img
            :src="book?.imageSrc"
            :alt="book?.title"
            :class="{ 'cover-image': !isLink, 'cover-image-link': isLink }"
        />
        <div class="book-info-container" :class="{ 'link-layout': isLink }">
            <h3 class="book-title" :class="{ 'link-book-title': isLink }">
                {{ book?.title }}
            </h3>
            <BookInfoItems :book="book" :isLink="isLink" />
            <NominatedBy :book="book" :isLink="isLink" />
            <DateCompleted v-if="isLink" :book="book" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import BookInfoItems from "./BookInfoItems.vue";
import NominatedBy from "./NominatedBy.vue";
import DateCompleted from "./DateCompleted.vue";

defineOptions({
    name: "BookInfo",
});

withDefaults(
    defineProps<{
        book: Book;
        isLink?: boolean;
    }>(),
    {
        isLink: false,
    }
);
</script>

<style scoped>
.book-info-content {
    flex: 1;
    height: 100%;
    display: flex;
    gap: 1rem;
}

.cover-image {
    max-width: 120px;
    object-fit: cover;
}

.cover-image-link {
    max-width: 100px;
    object-fit: cover;
}

.book-info-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.book-title {
    width: 100%;
    font-size: 1.25rem;
    font-style: italic;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    text-align: right;
}

.link-book-title {
    font-size: 1.25rem;
}

.link-layout {
    justify-content: space-evenly;
}

@media (min-width: 768px) {
    .book-info-content {
        gap: 1.5rem;
    }
    .cover-image {
        max-width: 200px;
    }
    .book-title {
        font-size: 2.25rem;
    }
    .link-book-title {
        font-size: 1.35rem;
    }
}
</style>
