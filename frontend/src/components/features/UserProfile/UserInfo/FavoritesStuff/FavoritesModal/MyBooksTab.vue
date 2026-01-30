<template>
    <div class="my-books-tab">
        <div v-if="!haveReadBooks.length" class="empty-state">
            <FontAwesomeIcon :icon="faBook" class="empty-icon" />
            <p class="empty-title">you haven't read shit, my man, sheeeeesh</p>
            <p class="empty-hint">
                fuckin' read something fer chrissakes, you degenerate wastoid
            </p>
        </div>
        <div v-else class="books-grid">
            <BookListItem
                v-for="book in haveReadBooks"
                :key="book.id"
                :book="book"
                :selectable="true"
                :selected="isSelected(book)"
                :disabled="isAlreadyFavorited(book)"
                @click="handleToggle"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import BookListItem from "../BookListItem.vue";
import type { BookshelfBook } from "@/types";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
    selectedBooks: BookshelfBook[];
    currentFavorites: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "toggle", book: BookshelfBook): void;
}>();

const { loggedInUser } = useUserStore();

const haveReadBooks = computed(() => {
    return loggedInUser.haveRead || [];
});

const isSelected = (book: BookshelfBook) => {
    return props.selectedBooks.some((b) => b.id === book.id);
};

const isAlreadyFavorited = (book: BookshelfBook) => {
    return props.currentFavorites.some((b) => b.id === book.id);
};

const handleToggle = (book: BookshelfBook) => {
    emit("toggle", book);
};
</script>

<style scoped>
.my-books-tab {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 350px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    gap: 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--accent-blue) 3%, transparent);
}

.empty-icon {
    font-size: 3rem;
    color: var(--accent-blue);
    opacity: 0.5;
}

.empty-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
}

.empty-hint {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    max-height: 400px;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .my-books-tab {
        min-height: 300px;
    }

    .empty-state {
        padding: 2rem 1.5rem;
    }

    .empty-icon {
        font-size: 2.5rem;
    }

    .empty-title {
        font-size: 1rem;
    }

    .empty-hint {
        font-size: 0.85rem;
    }

    .books-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        max-height: 350px;
    }
}
</style>
