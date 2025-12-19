<template>
    <form @submit.prevent="submit" class="form">
        <div class="form-container">
            <label for="edit-book-title" class="title-label">
                {{ shelfMessage }}
            </label>
            <BaseInput
                v-model="title"
                id="edit-book-title"
                label="title"
                size="medium"
                placeholder="book title"
                disabled
            />
        </div>

        <div v-if="isLoading" class="spinner-container">
            <LoadingSpinner size="medium" message="searching for book..." />
        </div>

        <template v-if="showBookDetails && !isLoading">
            <div class="form-row">
                <div class="form-container">
                    <label for="edit-book-author" class="label">author</label>
                    <BaseInput
                        v-model="author"
                        id="edit-book-author"
                        label="author"
                        size="medium"
                        placeholder="author"
                        disabled
                    />
                </div>
                <div class="form-container">
                    <label for="edit-book-year" class="label"
                        >year published</label
                    >
                    <BaseInput
                        v-model="yearPublished"
                        id="edit-book-year"
                        label="year published"
                        placeholder="year"
                        size="medium"
                        disabled
                    />
                </div>
            </div>

            <div class="form-container">
                <label for="edit-book-tags" class="label"
                    >tags (optional)</label
                >
                <BookTagsSelector :tags="tags" :onClick="toggleTag" />
            </div>

            <div class="form-container">
                <label for="edit-book-comment" class="label"
                    >comment (optional)</label
                >
                <BaseTextArea
                    v-model="comment"
                    id="edit-book-comment"
                    label="comment"
                    placeholder="add your thoughts about this book..."
                    :style="{ height: '120px' }"
                />
            </div>
        </template>

        <div v-if="!showBookDetails && !isLoading" class="no-book-details">
            <p>enter a title and we'll find the rest</p>
        </div>

        <FormActions
            v-if="showBookDetails && !isLoading"
            :canSubmit="canSubmit"
            :shelfDisplayName="shelfDisplayName"
            action="update"
            @closeModal="closeModal"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import BookTagsSelector from "@/components/form/BookTagsSelector.vue";
import { useUserShelves } from "@/composables/useUserShelves";
import { getShelfSuccessMessage } from "@/utils";
import type { FutureBook, OpenLibraryBookResult, Shelf } from "@/types";
import { useShelfModalStore } from "@/stores/shelfModal";
import FormActions from "../FormStuff/FormActions.vue";

const props = defineProps<{
    book: FutureBook;
    selectedShelf: Shelf;
    shelfMessage: string;
    shelfDisplayName: string;
}>();

const { updateWantToRead, updateHaveRead, updateCurrentlyReading } =
    useUserShelves();
const { openAddBookSuccess, openAddBookError, closeModal } =
    useShelfModalStore();

const isLoading = ref(false);
const showBookDetails = ref(true); // Start with true since we have existing book data
const noBookFound = ref(false);

const loading = ref(false);
const title = ref("");
const author = ref("");
const yearPublished = ref("");
const tags = ref<string[]>([]);
const comment = ref("");
const bookResult = ref<OpenLibraryBookResult>({} as OpenLibraryBookResult);

// Initialize form with existing book data
onMounted(() => {
    title.value = props.book.title || "";
    author.value = props.book.author || "";
    yearPublished.value = props.book.yearPublished?.toString() || "";
    tags.value = props.book.tags || [];
    comment.value = props.book.description || "";

    // Set up bookResult for the image
    if (props.book.imageSrc) {
        // Extract cover_i from imageSrc if it's an OpenLibrary URL
        const coverMatch = props.book.imageSrc.match(/\/b\/id\/(\d+)-/);
        if (coverMatch) {
            bookResult.value = {
                cover_i: parseInt(coverMatch[1]),
            } as OpenLibraryBookResult;
        }
    }
});

const canSubmit = computed(() => {
    return (
        title.value.trim().length > 0 &&
        author.value.trim().length > 0 &&
        yearPublished.value.trim().length > 0
    );
});

const toggleTag = (tag: string) => {
    if (tags.value.includes(tag)) {
        tags.value = tags.value.filter((t) => t !== tag);
    } else {
        tags.value.push(tag);
    }
};

const resetForm = () => {
    // Reset to original book values
    title.value = props.book.title || "";
    author.value = props.book.author || "";
    yearPublished.value = props.book.yearPublished?.toString() || "";
    tags.value = props.book.tags || [];
    comment.value = props.book.description || "";
    showBookDetails.value = true;
    noBookFound.value = false;
};

const submit = async () => {
    try {
        loading.value = true;

        const updatedBook: FutureBook = {
            votes: [],
            title: title.value,
            author: author.value,
            yearPublished: parseInt(yearPublished.value),
            tags: tags.value,
            description: comment.value,
            imageSrc: props.book.imageSrc,
            id: props.book.id,
        };

        if (props.selectedShelf === "wantToRead") {
            await updateWantToRead(props.book.id, updatedBook);
        } else if (props.selectedShelf === "haveRead") {
            await updateHaveRead(props.book.id, updatedBook);
        } else if (props.selectedShelf === "currentlyReading") {
            await updateCurrentlyReading(updatedBook);
        } else {
            throw new Error("Invalid shelf selected");
        }

        const message = getShelfSuccessMessage(props.selectedShelf);
        openAddBookSuccess(updatedBook, props.selectedShelf, message);
        resetForm();
    } catch (error) {
        openAddBookError(
            props.book,
            props.selectedShelf,
            "error updating book: " + (error as Error).message
        );
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.form-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 200px;
}

.label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.title-label {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.no-book-details {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
    .form {
        gap: 0.75rem;
    }

    .form-row {
        flex-direction: column;
        gap: 0.75rem;
    }

    .title-label {
        font-size: 1.25rem;
    }

    .label {
        font-size: 1.1rem;
    }

    .no-book-details {
        min-height: 150px;
        font-size: 1.125rem;
        padding: 1rem;
    }
}
</style>
