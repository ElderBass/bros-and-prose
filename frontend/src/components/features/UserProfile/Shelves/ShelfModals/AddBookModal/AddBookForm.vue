<template>
    <form @submit.prevent="submit" class="form">
        <div class="form-container">
            <label
                v-if="!noBookFound"
                for="shelf-book-title"
                class="title-label"
                >{{ shelfMessage }}</label
            >
            <label v-else for="shelf-book-title" class="title-label">
                book not found; you're on your own
            </label>
            <BaseInput
                v-model="title"
                id="shelf-book-title"
                label="title"
                size="medium"
                placeholder="book title"
            />
        </div>

        <div v-if="isLoading" class="spinner-container">
            <LoadingSpinner size="medium" message="searching for book..." />
        </div>

        <template v-if="showBookDetails && !isLoading">
            <div class="form-row">
                <div class="form-container">
                    <label for="shelf-book-author" class="label">author</label>
                    <BaseInput
                        v-model="author"
                        id="shelf-book-author"
                        label="author"
                        size="medium"
                        placeholder="author"
                    />
                </div>
                <div class="form-container">
                    <label for="shelf-book-year" class="label"
                        >year published</label
                    >
                    <BaseInput
                        v-model="yearPublished"
                        id="shelf-book-year"
                        label="year published"
                        placeholder="year"
                        size="medium"
                    />
                </div>
            </div>

            <div class="form-container">
                <label for="shelf-book-tags" class="label"
                    >tags (optional)</label
                >
                <BookTagsSelector :tags="tags" :onClick="toggleTag" />
            </div>

            <div class="form-container">
                <label for="shelf-book-comment" class="label"
                    >comment (optional)</label
                >
                <BaseTextArea
                    v-model="comment"
                    id="shelf-book-comment"
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
            @closeModal="closeModal"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
import BookTagsSelector from "@/components/form/BookTagsSelector.vue";
import { useBooks } from "@/composables/useBooks";
import { useUserShelves } from "@/composables/useUserShelves";
import { buildBookShelfEntry, getShelfSuccessMessage } from "@/utils";
import type { FutureBook, OpenLibraryBookResult } from "@/types/books";
import { useLog } from "@/composables/useLog";
import { useShelfModalStore } from "@/stores/shelfModal";
import FormActions from "./FormActions.vue";

const props = defineProps<{
    selectedShelf: "wantToRead" | "haveRead";
    shelfMessage: string;
    shelfDisplayName: string;
}>();

const { searchBooksByTitle } = useBooks();
const { addToWantToRead, addToHaveRead } = useUserShelves();
const { openAddBookSuccess, openAddBookError, closeModal } =
    useShelfModalStore();

const isLoading = ref(false);
const showBookDetails = ref(false);
const noBookFound = ref(false);

const loading = ref(false);
const title = ref("");
const author = ref("");
const yearPublished = ref("");
const tags = ref<string[]>([]);
const comment = ref("");
const bookResult = ref<OpenLibraryBookResult>({} as OpenLibraryBookResult);

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
    title.value = "";
    author.value = "";
    yearPublished.value = "";
    tags.value = [];
    comment.value = "";
    showBookDetails.value = false;
    noBookFound.value = false;
    bookResult.value = {} as OpenLibraryBookResult;
};

const runSearch = async () => {
    const query = title.value.trim();
    if (!query) {
        bookResult.value = {} as OpenLibraryBookResult;
        showBookDetails.value = false;
        return;
    }
    try {
        isLoading.value = true;
        const books = await searchBooksByTitle(query);
        bookResult.value = (books && books[0]) || {};

        if (bookResult.value.title && bookResult.value.author_name?.[0]) {
            showBookDetails.value = true;
            author.value = bookResult.value.author_name[0];
            yearPublished.value =
                bookResult.value.first_publish_year?.toString() || "";
        } else {
            noBookFound.value = true;
            showBookDetails.value = true;
        }
    } catch (e) {
        bookResult.value = {} as OpenLibraryBookResult;
        console.error("error in runSearch for shelf form", e);
        await useLog().error(`Error in runSearch for shelf form: ${e}`);
        openAddBookError(
            title.value,
            props.shelfDisplayName,
            "oof  bud, hit an error searching for that book..."
        );
    } finally {
        isLoading.value = false;
    }
};

const submit = async () => {
    try {
        loading.value = true;
        const book: FutureBook = buildBookShelfEntry(
            bookResult.value,
            comment.value,
            tags.value
        );

        if (props.selectedShelf === "wantToRead") {
            await addToWantToRead(book);
        } else {
            await addToHaveRead(book);
        }

        const message = getShelfSuccessMessage(props.selectedShelf);
        openAddBookSuccess(book.title, props.shelfDisplayName, message);
        resetForm();
    } catch (error) {
        openAddBookError(
            title.value,
            props.shelfDisplayName,
            "error adding book to shelf: " + (error as Error).message
        );
    } finally {
        loading.value = false;
    }
};

// Debounce search when the title changes
let searchTimer: number | null = null;
const DEBOUNCE_MS = 1200;

watch(
    title,
    () => {
        if (searchTimer) window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
            runSearch();
        }, DEBOUNCE_MS);
    },
    { flush: "post" }
);

onBeforeUnmount(() => {
    if (searchTimer) window.clearTimeout(searchTimer);
});
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

.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
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
    .shelf-form {
        gap: 0.75rem;
        min-height: 400px;
    }

    .shelf-selector {
        gap: 0.5rem;
    }

    .form {
        gap: 0.75rem;
    }

    .form-row {
        flex-direction: column;
        gap: 0.75rem;
    }

    .form-actions {
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 0.5rem;
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

    .stock-text {
        font-size: 1.125rem;
    }
}
</style>
