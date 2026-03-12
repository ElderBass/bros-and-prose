<template>
    <div class="bookshelf-book-list-item-container">
        <div class="bookshelf-book-list-item">
            <div class="cover-and-info">
                <BookCover :imageSrc="book.imageSrc" :title="book.title" />

                <div class="info">
                    <div class="title-container">
                        <h3 class="title">{{ book.title }}</h3>
                        <BookshelfBookListItemActions
                            :isLoggedInUser="isLoggedInUser"
                            :book="book"
                            :shelf="shelf"
                        />
                    </div>

                    <BookMetadata
                        :author="book.author"
                        :yearPublished="book.yearPublished"
                        :pages="book.pages"
                    />

                    <TagsContainer :tags="book.tags" />
                </div>
            </div>

            <ExpandableText
                :text="book.description || EMPTY_TEXT"
                :truncateLength="100"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { BookshelfBook, Shelf } from "@/types";
import BookCover from "@/components/features/common/BookCover.vue";
import BookMetadata from "@/components/features/common/BookMetadata.vue";
import TagsContainer from "../../common/TagsContainer.vue";
import BookshelfBookListItemActions from "@/components/features/UserProfile/Shelves/BookshelfListItemActions.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import { EMPTY_TEXT } from "@/constants";

defineProps<{
    book: BookshelfBook;
    shelf: Shelf;
    isLoggedInUser: boolean;
}>();
</script>

<style scoped>
.bookshelf-book-list-item-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 0.5rem;
    background-color: var(--surface-color);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    flex: 1 0 100%;
}

.bookshelf-book-list-item {
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

.italics {
    font-style: italic;
}

@media (min-width: 768px) {
    .bookshelf-book-list-item-container {
        flex: 1 0 60%;
    }

    .bookshelf-book-list-item {
        gap: 1rem;
        padding: 0.75rem;
    }

    .cover-and-info {
        gap: 1rem;
    }

    .title {
        font-size: 1.375rem;
    }

    .description {
        font-size: 1.125rem;
        padding-top: 0.75rem;
        padding-left: 0.75rem;
    }
}
</style>
