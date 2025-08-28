<template>
    <BaseCard shadowColor="blue" size="medium">
        <div v-if="book" class="book-card-content">
            <img :src="book.imageSrc" :alt="book.title" class="cover-image" />
            <div class="book-card-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <div class="book-info-container">
                    <div
                        class="info-item"
                        v-for="item in bookInfoItems"
                        :key="item.label"
                    >
                        <p>{{ item.label }}</p>
                        <p class="info-value">{{ item.value }}</p>
                    </div>
                </div>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import { computed } from "vue";

const props = defineProps<{
    book: Book | null;
}>();

const bookInfoItems = computed(() => {
    return [
        {
            label: "author",
            value: props.book?.author,
        },
        {
            label: "published",
            value: props.book?.yearPublished,
        },
        {
            label: "pages",
            value: props.book?.totalPages,
        },

        {
            label: "goodreads score",
            value: props.book?.goodreadsRating,
        },
    ];
});
</script>

<style scoped>
.cover-image {
    max-width: 120px;
    object-fit: cover;
}

.book-card-content {
    flex: 1;
    height: 100%;
    display: flex;
    gap: 1rem;
}

.book-card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.book-title {
    width: 100%;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    text-align: right;
}

.book-info-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: space-between;
    text-align: right;
    width: 100%;
}

p {
    font-size: 0.85rem;
}

.info-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-blue);
}

.user-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
}

.user-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-actions {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
}

@media (min-width: 768px) {
    .book-card-content {
        gap: 3rem;
    }
    .cover-image {
        max-width: 200px;
    }
    .book-title {
        font-size: 2.25rem;
    }
    p {
        font-size: 1.5rem;
    }
    .info-value {
        font-size: 1.5rem;
    }
}
</style>
