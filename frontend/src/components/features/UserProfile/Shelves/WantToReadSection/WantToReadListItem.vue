<template>
    <div class="want-to-read-list-item-container">
        <div class="want-to-read-list-item">
            <div class="cover-and-info">
                <img
                    v-if="book.imageSrc"
                    class="cover"
                    :src="book.imageSrc"
                    :alt="book.title"
                />
                <div v-else class="cover-placeholder">
                    <FontAwesomeIcon :icon="faBook" />
                </div>
                <div class="info">
                    <div class="title-container">
                        <h3 class="title">{{ book.title }}</h3>
                        <ListItemActions v-if="showActions" :book="book" />
                    </div>
                    <div class="author-and-meta">
                        <p class="author">{{ book.author }}</p>
                        <span v-if="book.yearPublished" class="separator"
                            >|</span
                        >
                        <p v-if="book.yearPublished" class="meta">
                            {{ book.yearPublished }}
                        </p>
                    </div>
                    <div v-if="book.tags?.length" class="tags">
                        <BookTag
                            v-for="tag in book.tags.slice(0, 3)"
                            :key="tag"
                            :tag="tag"
                            :selected="true"
                            color="blue"
                            :size="mobile ? 'xsmall' : 'small'"
                        />
                    </div>
                </div>
            </div>
            <p v-if="book.description" class="description">
                {{ book.description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";
import ListItemActions from "@/components/features/UserProfile/Shelves/WantToReadSection/ListItemActions.vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
    book: FutureBook;
    showActions: boolean;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.want-to-read-list-item-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0.5rem;
    background-color: var(--surface-color);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    flex: 1 0 100%;
}
.want-to-read-list-item {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
}

.cover-and-info {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.cover {
    flex: 0 0 60px;
    width: 60px;
    height: 90px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid var(--accent-blue);
}

.cover-placeholder {
    flex: 0 0 60px;
    width: 60px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.1),
        rgba(0, 191, 255, 0.05)
    );
    border: 2px dashed var(--accent-blue);
    border-radius: 0.5rem;
    color: var(--accent-blue);
    font-size: 1.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}

.title-container {
    display: flex;
    gap: 0.25rem;
    justify-content: space-between;
    width: 100%;
}

.title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.3;
}

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

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
}

.description {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--main-text);
    opacity: 0.9;
    padding-top: 0.5rem;
    border-top: 1px solid var(--accent-blue);
    border-left: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
}

@media (min-width: 768px) {
    .want-to-read-list-item-container {
        flex: 1 0 60%;
    }

    .want-to-read-list-item {
        gap: 1rem;
        padding: 0.75rem;
    }

    .cover-and-info {
        gap: 1rem;
    }

    .cover,
    .cover-placeholder {
        flex: 0 0 80px;
        width: 80px;
        height: 120px;
    }

    .cover-placeholder {
        font-size: 2rem;
    }

    .title {
        font-size: 1.375rem;
    }

    .author-and-meta {
        font-size: 1.25rem;
    }

    .description {
        font-size: 1.125rem;
        padding-top: 0.75rem;
        padding-left: 0.75rem;
    }

    .tags {
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
}
</style>
