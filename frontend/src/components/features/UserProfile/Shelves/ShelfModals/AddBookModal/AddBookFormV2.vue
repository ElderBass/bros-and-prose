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
            <div class="search-row">
                <BaseInput
                    v-model="title"
                    id="shelf-book-title"
                    label="title"
                    size="medium"
                    placeholder="book title"
                />
                <ClearSearchButton
                    :onClick="resetForm"
                    :disabled="!title.trim().length"
                />
            </div>
        </div>

        <div v-if="loading" class="spinner-container">
            <SkeletonLoader
                :count="5"
                type="list-item-avatar-two-line"
                :height="76"
                tone="blue"
            />
        </div>

        <div v-if="showResults && !loading" class="results">
            <p class="results-title">pick the right prose for ya, bro:</p>
            <V2FormResult
                v-for="(result, index) in results"
                :key="`${result.title}-${result.author}`"
                :result="result"
                :selected="selectedResultIndex === index"
                @selectResult="selectResult(result)"
            />
        </div>

        <template v-if="bookSelected && !loading">
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
                <div class="year-and-pages-row">
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
                    <div class="form-container">
                        <label for="shelf-book-pages" class="label"
                            >pages</label
                        >
                        <BaseInput
                            v-model="pages"
                            type="number"
                            id="shelf-book-pages"
                            label="pages"
                            placeholder="pages"
                            size="medium"
                        />
                    </div>
                </div>
            </div>

            <div class="form-container">
                <TagPickerTrigger
                    v-if="USE_TAG_PICKER_TRIGGER"
                    v-model="tags"
                    label="tags (optional)"
                    variant="drawer"
                />
                <InlineBookTagsPicker
                    v-else
                    label="tags (optional)"
                    v-model="tags"
                    @update="toggleTag"
                />
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

        <div
            v-if="!showResults && !bookSelected && !loading"
            class="no-book-details"
        >
            <p>enter a title and we’ll divine some books</p>
            <span style="color: var(--accent-fuschia)">#godsplan</span>
        </div>

        <FormActionsV2
            v-if="bookSelected && !loading"
            :canSubmit="canSubmit"
            :shelfDisplayName="shelfDisplayName"
            @cancel="bookSelected = false"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue";
import { useBooks } from "@/composables/useBooks";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { capitalizeBookTitle, getShelfSuccessMessage } from "@/utils";
import type { BookshelfBook, Shelf } from "@/types/books";
import { useLog } from "@/composables/useLog";
import V2FormResult from "./V2FormResult.vue";
import InlineBookTagsPicker from "@/components/form/InlineBookTagsPicker.vue";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";
import FormActionsV2 from "../FormStuff/FormActionsV2.vue";
import { v4 as uuid } from "uuid";
import ClearSearchButton from "../FormStuff/ClearSearchButton.vue";
import { EMPTY_SHELF_BOOK } from "@/constants";
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";

defineOptions({ name: "AddBookFormV2" });

const USE_TAG_PICKER_TRIGGER = true;

const props = defineProps<{
    selectedShelf: Shelf;
    shelfMessage: string;
    shelfDisplayName: string;
}>();

const { searchGoogleByTitle } = useBooks();
const { addToWantToRead, addToHaveRead, addToCurrentlyReading } =
    useUserShelves();
const { openBookActionSuccess, openAddBookError } = useShelfModalStore();

const showBookDetails = ref(false);
const noBookFound = ref(false);
const bookSelected = ref(false);

const loading = ref(false);
const title = ref("");
const author = ref("");
const imageSrc = ref("");
const yearPublished = ref("");
const pages = ref<number | undefined>(undefined);
const tags = ref<string[]>([]);
const comment = ref("");

const results = ref<BookshelfBook[]>([]);
const selectedResultIndex = ref<number | null>(null);

const selectedResult = computed(() => {
    if (selectedResultIndex.value === null) return null;
    return results.value[selectedResultIndex.value] || null;
});

const showResults = computed(() => {
    return results.value.length > 0 && !bookSelected.value;
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
    title.value = "";
    author.value = "";
    yearPublished.value = "";
    pages.value = undefined;
    tags.value = [];
    comment.value = "";
    showBookDetails.value = false;
    noBookFound.value = false;
    results.value = [];
    selectedResultIndex.value = null;
    bookSelected.value = false;
};

const selectResult = (result: BookshelfBook) => {
    bookSelected.value = true;

    title.value = result.title || title.value;
    author.value = result.author || "";
    imageSrc.value = result.imageSrc || "";
    yearPublished.value = result.yearPublished
        ? String(result.yearPublished)
        : "";
    pages.value = result.pages;
    showBookDetails.value = true;
};

const runSearch = async () => {
    if (bookSelected.value) return;
    const query = title.value.trim();
    if (!query) {
        results.value = [];
        showBookDetails.value = false;
        noBookFound.value = false;
        return;
    }

    try {
        loading.value = true;
        const books = await searchGoogleByTitle(query);
        results.value = books || [];

        if (!results.value.length) {
            noBookFound.value = true;
            showBookDetails.value = true; // manual mode
            selectedResultIndex.value = null;
        } else {
            noBookFound.value = false;
            showBookDetails.value = false; // wait for user selection
            selectedResultIndex.value = null;
        }
    } catch (e) {
        console.error("error in runSearch for shelf form (google)", e);
        await useLog().error(`Error in google runSearch for shelf form: ${e}`);
        openAddBookError(
            EMPTY_SHELF_BOOK,
            props.selectedShelf,
            "oof bud, hit an error searching for that book..."
        );
        results.value = [];
        showBookDetails.value = true;
        noBookFound.value = true;
    } finally {
        loading.value = false;
    }
};

const submit = async () => {
    try {
        loading.value = true;

        const year = Number.parseInt(yearPublished.value, 10);
        const book: BookshelfBook = {
            id: uuid(),
            title: capitalizeBookTitle(title.value),
            author: author.value.trim(),
            yearPublished: Number.isFinite(year) ? year : 0,
            imageSrc: imageSrc.value || "",
            pages: pages.value,
            tags: tags.value,
            description:
                comment.value.trim() ||
                selectedResult.value?.description?.trim() ||
                "",
        };

        if (props.selectedShelf === "wantToRead") {
            await addToWantToRead(book);
        } else if (props.selectedShelf === "haveRead") {
            await addToHaveRead(book);
        } else if (props.selectedShelf === "currentlyReading") {
            await addToCurrentlyReading(book);
        } else {
            throw new Error("Invalid shelf selected");
        }

        const message = getShelfSuccessMessage(props.selectedShelf);
        openBookActionSuccess("add", book, props.selectedShelf, message);
        resetForm();
    } catch (error) {
        openAddBookError(
            EMPTY_SHELF_BOOK,
            props.selectedShelf,
            "error adding book to shelf: " + (error as Error).message
        );
    } finally {
        loading.value = false;
    }
};

// Debounce search when the title changes
let searchTimer: number | null = null;
const DEBOUNCE_MS = 900;

watch(
    title,
    () => {
        // If user edits title after selecting a result, reset the "picked" state
        showBookDetails.value = false;
        selectedResultIndex.value = null;

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
    flex: 1 0 auto;
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

.search-row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
}

.year-and-pages-row {
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
    flex: 1;
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
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

.results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.results-title {
    margin: 0;
    padding-left: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
    font-style: italic;
}

@media (max-width: 768px) {
    .form {
        gap: 0.75rem;
    }

    .title-label {
        font-size: 1.25rem;
    }

    .form-row {
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-size: 1.1rem;
    }

    .no-book-details {
        font-size: 1.125rem;
        padding: 1rem;
    }
}
</style>
