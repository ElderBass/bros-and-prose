<template>
    <div class="selected-books-list">
        <div class="list-header">
            <h3 class="list-title">
                sus selections
                <span class="count">({{ selectedBooks.length }})</span>
            </h3>
            <BaseButton
                v-if="selectedBooks.length"
                size="xsmall"
                variant="outline-error"
                title="get that mindless drivel outta here"
                @click="handleClear"
            >
                <FontAwesomeIcon :icon="faXmark" />
                wipe'em
            </BaseButton>
        </div>
        <div v-if="!selectedBooks.length" class="empty-state">
            <p>nothing selected yet, thank god</p>
            <p class="hint">fuckin' figure it out and fav something, bud</p>
        </div>
        <div v-else class="books-list">
            <div
                v-for="book in selectedBooks"
                :key="book.id"
                class="selected-book-item"
            >
                <div class="book-thumbnail">
                    <img
                        v-if="book.imageSrc"
                        :src="book.imageSrc"
                        :alt="book.title"
                        class="thumbnail-image"
                    />
                    <div v-else class="thumbnail-placeholder">
                        <FontAwesomeIcon
                            :icon="faBook"
                            class="placeholder-icon"
                        />
                    </div>
                </div>
                <div class="book-details">
                    <p class="book-title">{{ truncateTitle(book.title) }}</p>
                    <p class="book-author">{{ truncateAuthor(book.author) }}</p>
                </div>
                <IconButton
                    :icon="faTrash"
                    size="small"
                    color="red"
                    title="remove"
                    :handleClick="() => handleRemove(book)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBook, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    selectedBooks: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "remove", book: BookshelfBook): void;
    (e: "clear"): void;
}>();

const truncateTitle = (title: string) => {
    return title.length > 35 ? title.substring(0, 35) + "..." : title;
};

const truncateAuthor = (author: string) => {
    return author.length > 25 ? author.substring(0, 25) + "..." : author;
};

const handleRemove = (book: BookshelfBook) => {
    emit("remove", book);
};

const handleClear = () => {
    emit("clear");
};
</script>

<style scoped>
.selected-books-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid var(--accent-lavender);
    border-radius: 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-lavender) 8%, transparent),
        color-mix(in srgb, var(--accent-lavender) 4%, transparent)
    );
    max-height: 300px;
    overflow-y: auto;
}

.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.list-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-lavender);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.count {
    font-size: 0.95rem;
    color: var(--text-muted);
    font-weight: 400;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    text-align: center;
    gap: 0.5rem;
}

.empty-state p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--text-muted);
}

.hint {
    font-size: 0.85rem;
    font-style: italic;
    opacity: 0.7;
}

.books-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.selected-book-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: var(--surface-color);
    border: 1px solid var(--accent-lavender);
    transition: all 0.2s ease;
}

.selected-book-item:hover {
    border-color: var(--accent-fuschia);
    box-shadow: 0 2px 8px rgba(255, 77, 255, 0.15);
}

.book-thumbnail {
    width: 40px;
    height: 55px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0.25rem;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
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
        color-mix(in srgb, var(--accent-lavender) 15%, transparent),
        color-mix(in srgb, var(--accent-lavender) 8%, transparent)
    );
    border: 1px solid var(--accent-lavender);
}

.placeholder-icon {
    font-size: 1.25rem;
    color: var(--accent-lavender);
    opacity: 0.5;
}

.book-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}

.book-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.book-author {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 768px) {
    .selected-books-list {
        padding: 0.75rem;
        max-height: 250px;
    }

    .list-title {
        font-size: 1rem;
    }

    .selected-book-item {
        padding: 0.4rem;
        gap: 0.5rem;
    }

    .book-thumbnail {
        width: 35px;
        height: 48px;
    }

    .book-title {
        font-size: 0.85rem;
    }

    .book-author {
        font-size: 0.75rem;
    }
}
</style>
