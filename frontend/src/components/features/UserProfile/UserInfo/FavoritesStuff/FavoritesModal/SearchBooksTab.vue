<template>
    <div class="search-books-tab">
        <BaseInput
            v-model="searchQuery"
            label="Search for books by title or author..."
            placeholder="Search for books by title or author..."
            id="search-books-tab-input"
            :size="mobile ? 'small' : 'medium'"
            @update:modelValue="handleSearchInput"
        />

        <LoadingSpinnerContainer
            v-if="searching"
            size="medium"
            message="searching books..."
        />

        <div v-else-if="error" class="error-state">
            <FontAwesomeIcon :icon="faExclamationTriangle" class="error-icon" />
            <p class="error-message">{{ error }}</p>
            <p class="error-hint">
                You can still add books from your HaveRead shelf
            </p>
        </div>

        <div v-else-if="searchResults.length" class="results-grid">
            <BookListItem
                v-for="book in searchResults"
                :key="book.id"
                :book="book"
                :selectable="true"
                :selected="isSelected(book)"
                @click="handleToggle"
            />
        </div>

        <div v-else-if="hasSearched" class="empty-results">
            <FontAwesomeIcon :icon="faSearch" class="empty-icon" />
            <p class="empty-title">No books found</p>
            <p class="empty-hint">Try a different search term</p>
        </div>

        <div v-else class="initial-state">
            <FontAwesomeIcon :icon="faSearch" class="initial-icon" />
            <p class="initial-text">Enter a book title or author to search</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faSearch,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseInput from "@/components/form/BaseInput.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import BookListItem from "../BookListItem.vue";
import type { BookshelfBook } from "@/types";
import { booksService } from "@/services/books";

const { mobile } = useDisplay();

const props = defineProps<{
    selectedBooks: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "toggle", book: BookshelfBook): void;
}>();

const searchQuery = ref("");
const searchResults = ref<BookshelfBook[]>([]);
const searching = ref(false);
const error = ref("");
const hasSearched = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const isSelected = (book: BookshelfBook) => {
    return props.selectedBooks.some((b) => b.id === book.id);
};

const handleToggle = (book: BookshelfBook) => {
    emit("toggle", book);
};

const performSearch = async () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        hasSearched.value = false;
        error.value = "";
        return;
    }
    try {
        searching.value = true;
        error.value = "";
        const results = await booksService.searchGoogleBooksForFavorites(
            searchQuery.value.trim()
        );
        searchResults.value = results;
        hasSearched.value = true;
    } catch (err) {
        console.error("Search error:", err);
        error.value =
            (err as Error).message ||
            "Failed to search books. Please try again.";
        searchResults.value = [];
        hasSearched.value = true;
    } finally {
        searching.value = false;
    }
};

const handleSearchInput = () => {
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Debounce search by 500ms
    searchTimeout = setTimeout(() => {
        performSearch();
    }, 500);
};
</script>

<style scoped>
.search-books-tab {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    min-height: 350px;
}

.error-state,
.empty-results,
.initial-state {
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
    flex: 1;
}

.error-state {
    border-color: var(--accent-red);
    background: color-mix(in srgb, var(--accent-red) 5%, transparent);
}

.error-icon {
    font-size: 3rem;
    color: var(--accent-red);
    opacity: 0.7;
}

.error-message {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--accent-red);
}

.error-hint {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
}

.empty-icon,
.initial-icon {
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

.empty-hint,
.initial-text {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-muted);
    font-style: italic;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    max-height: 400px;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .search-books-tab {
        min-height: 300px;
    }

    .error-state,
    .empty-results,
    .initial-state {
        padding: 2rem 1.5rem;
    }

    .error-icon,
    .empty-icon,
    .initial-icon {
        font-size: 2.5rem;
    }

    .error-message,
    .empty-title {
        font-size: 1rem;
    }

    .error-hint,
    .empty-hint,
    .initial-text {
        font-size: 0.85rem;
    }

    .results-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        max-height: 350px;
    }
}
</style>
