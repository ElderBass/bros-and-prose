<template>
    <div class="book-badge" @click="handleClick">
        <div class="badge-thumbnail">
            <img
                v-if="book.imageSrc"
                :src="book.imageSrc"
                :alt="book.title"
                class="thumbnail-image"
            />
            <div v-else class="thumbnail-placeholder">
                <FontAwesomeIcon :icon="faBook" class="placeholder-icon" />
            </div>
        </div>
        <div class="badge-content">
            <h4 class="badge-title">{{ truncatedTitle }}</h4>
            <p class="badge-author">{{ truncatedAuthor }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import type { BookshelfBook } from "@/types";

const { book } = defineProps<{
    book: BookshelfBook;
}>();

const emit = defineEmits<{
    (e: "click", book: BookshelfBook): void;
}>();

const truncatedTitle = computed(() => {
    if (book.title.length > 30) {
        return book.title.substring(0, 30) + "...";
    }
    return book.title;
});

const truncatedAuthor = computed(() => {
    if (book.author.length > 20) {
        return book.author.substring(0, 20) + "...";
    }
    return book.author;
});

const handleClick = () => {
    emit("click", book);
};
</script>

<style scoped>
.book-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 2px solid var(--accent-fuschia);
    border-radius: 0.75rem;
    background: linear-gradient(
        180deg,
        var(--surface-color),
        color-mix(in srgb, var(--surface-color) 90%, var(--accent-fuschia))
    );
    box-shadow:
        0 4px 12px rgba(255, 77, 255, 0.2),
        0 0 20px rgba(255, 77, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.book-badge:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow:
        0 8px 24px rgba(255, 77, 255, 0.35),
        0 0 40px rgba(255, 77, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.badge-thumbnail {
    padding: 0.25rem;
    width: 100%;
    height: 100%;
    max-width: 40px;
    position: relative;
    overflow: hidden;
    align-content: center;
}

.thumbnail-image {
    width: 100%;
    object-fit: cover;
}

.thumbnail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-fuschia) 15%, transparent),
        color-mix(in srgb, var(--accent-fuschia) 8%, transparent)
    );
    border-bottom: 1px solid var(--accent-fuschia);
}

.placeholder-icon {
    font-size: 2rem;
    color: var(--accent-fuschia);
    opacity: 0.5;
}

.badge-content {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2rem;
    overflow: hidden;
}

.badge-title {
    margin: 0;
    font-family: "Courier New", serif;
    font-style: italic;
    font-size: 0.8rem;
    color: var(--accent-fuschia);
    font-weight: 600;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.badge-author {
    margin: 0;
    font-size: 0.7rem;
    color: var(--accent-green);
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 768px) {
    .badge-content {
        padding: 0.4rem;
    }

    .badge-title {
        font-size: 0.75rem;
    }

    .badge-author {
        font-size: 0.65rem;
    }

    .placeholder-icon {
        font-size: 1.75rem;
    }
}
</style>
