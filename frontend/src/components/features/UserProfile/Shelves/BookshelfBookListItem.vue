<template>
    <div class="bookshelf-book-list-item-container">
        <div class="bookshelf-book-list-item">
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
                        <BookshelfBookListItemActions
                            v-if="showActions"
                            :book="book"
                            :shelf="shelf"
                        />
                    </div>

                    <div class="author-and-meta">
                        <p class="author">{{ book.author }}</p>
                        <span v-if="book.yearPublished" class="separator"
                            >|</span
                        >
                        <p v-if="book.yearPublished" class="meta">
                            {{ book.yearPublished }}
                        </p>
                        <span v-if="book.pages" class="separator">|</span>
                        <p v-if="book.pages" class="meta">
                            {{ book.pages }} pages
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
                    <div v-else class="no-tags">
                        <span class="italics">no tags like Hanes briefs</span>
                    </div>
                </div>
            </div>

            <p class="description">
                <span v-if="book.description">
                    {{ book.description }}
                </span>
                <span v-else class="italics"> homeboy ain't said shit </span>
            </p>
        </div>
        <div v-if="shelf === 'currentlyReading'" class="actions">
            <BaseButton
                title="finished (move to have read)"
                variant="outline-success"
                v-bind="buttonProps"
                @click="handleFinished"
            >
                <FontAwesomeIcon :icon="faCircleCheck" />
                finished
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook, Shelf } from "@/types";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";
import BookshelfBookListItemActions from "@/components/features/UserProfile/Shelves/BookshelfBookListItemActions.vue";
import { faBook, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useUserShelves } from "@/composables/useUserShelves";

defineOptions({ name: "BookshelfBookListItem" });

const props = defineProps<{
    book: BookshelfBook;
    shelf: Shelf;
    showActions: boolean;
}>();

const { mobile } = useDisplay();

const { finishCurrentlyReading } = useUserShelves();

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: { width: "100%" },
    };
});

const handleFinished = async () => {
    await finishCurrentlyReading(props.book.id);
};
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

.no-tags {
    text-align: center;
    max-width: 60%;
    border: 1px dashed var(--accent-blue);
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--main-text);
    opacity: 0.75;
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

.actions {
    padding: 0 0.5rem 0.5rem 0.5rem;
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
