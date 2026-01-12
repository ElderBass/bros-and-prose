<template>
    <div class="step-form">
        <h3 class="step-title">review your selections</h3>
        <p class="step-description">
            here's what you've got - looking good or need to add more?
        </p>

        <div class="review-sections">
            <!-- Authors Section -->
            <div class="review-section">
                <div class="section-header">
                    <h4 class="section-title">
                        <FontAwesomeIcon
                            :icon="faFeather"
                            class="section-icon"
                        />
                        authors
                        <span class="count">({{ authorsCount }})</span>
                    </h4>
                    <EditButton
                        title="edit authors"
                        :buttonSize="editButtonSize"
                        :handleEdit="() => emit('goToStep', 1)"
                    />
                </div>
                <div v-if="authors.length > 0" class="items-list">
                    <div
                        v-for="(author, index) in authors"
                        :key="index"
                        class="item"
                    >
                        {{ author }}
                    </div>
                </div>
                <p v-else class="empty-text">no authors added yet</p>
            </div>

            <!-- Genres Section -->
            <div class="review-section">
                <div class="section-header">
                    <h4 class="section-title">
                        <FontAwesomeIcon
                            :icon="faMasksTheater"
                            class="section-icon"
                        />
                        genres
                        <span class="count">({{ genresCount }})</span>
                    </h4>
                    <EditButton
                        title="edit genres"
                        :buttonSize="editButtonSize"
                        :handleEdit="() => emit('goToStep', 2)"
                    >
                        edit
                    </EditButton>
                </div>
                <div v-if="genres.length > 0" class="items-list">
                    <div
                        v-for="(genre, index) in genres"
                        :key="index"
                        class="item"
                    >
                        {{ genre }}
                    </div>
                </div>
                <p v-else class="empty-text">no genres added yet</p>
            </div>

            <!-- Books Section -->
            <div class="review-section">
                <div class="section-header">
                    <h4 class="section-title">
                        <FontAwesomeIcon :icon="faBook" class="section-icon" />
                        books
                        <span class="count">({{ booksCount }})</span>
                    </h4>
                    <EditButton
                        title="edit books"
                        :buttonSize="editButtonSize"
                        :handleEdit="() => emit('goToStep', 3)"
                    >
                        edit
                    </EditButton>
                </div>
                <div v-if="books.length > 0" class="books-list">
                    <div
                        v-for="(book, index) in books"
                        :key="index"
                        class="book-item"
                    >
                        <span class="book-title">{{ book.title }}</span>
                        <span class="book-author">by {{ book.author }}</span>
                    </div>
                </div>
                <p v-else class="empty-text">no books added yet</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import {
    faFeather,
    faMasksTheater,
    faBook,
} from "@fortawesome/free-solid-svg-icons";
import type { BookshelfBook } from "@/types";
import EditButton from "@/components/ui/EditButton.vue";

const props = defineProps<{
    authors: string[];
    genres: string[];
    books: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "goToStep", step: number): void;
}>();

const authorsCount = computed(() => props.authors.length);
const genresCount = computed(() => props.genres.length);
const booksCount = computed(() => props.books.length);

const { mobile } = useDisplay();
const editButtonSize = computed(() => (mobile.value ? "xsmall" : "small"));
</script>

<style scoped>
.step-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

.step-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.5rem;
    color: var(--accent-pink);
    margin: 0;
    text-transform: lowercase;
}

.step-description {
    font-size: 0.95rem;
    opacity: 0.8;
    margin: 0;
}

.review-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.review-section {
    border: 2px solid var(--accent-blue);
    border-radius: 0.75rem;
    padding: 1rem;
    background: color-mix(in srgb, var(--accent-blue) 3%, transparent);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    color: var(--accent-blue);
    margin: 0;
    text-transform: lowercase;
    font-weight: 600;
}

.section-icon {
    font-size: 1rem;
}

.count {
    font-size: 0.9rem;
    opacity: 0.7;
    font-weight: 400;
}

.items-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.item {
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent-blue) 15%, transparent);
    border: 1px solid var(--accent-blue);
    font-size: 0.9rem;
    color: var(--accent-blue);
}

.books-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.book-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background: color-mix(in srgb, var(--accent-blue) 10%, transparent);
    border-left: 3px solid var(--accent-blue);
}

.book-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--accent-fuschia);
}

.book-author {
    font-size: 0.85rem;
    opacity: 0.8;
    font-style: italic;
}

.empty-text {
    font-size: 0.9rem;
    opacity: 0.6;
    font-style: italic;
    margin: 0;
}

@media (max-width: 768px) {
    .section-title {
        font-size: 1rem;
    }

    .item {
        font-size: 0.85rem;
    }

    .book-title {
        font-size: 0.9rem;
    }

    .book-author {
        font-size: 0.8rem;
    }
}
</style>
