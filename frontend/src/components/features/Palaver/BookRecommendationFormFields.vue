<template>
    <div class="rec-fields">
        <div
            class="mode-selector"
            role="radiogroup"
            aria-label="recommendation source"
        >
            <button
                v-for="option in modeOptions"
                :key="option.value"
                type="button"
                class="mode-button"
                :class="{ active: mode === option.value }"
                :aria-checked="mode === option.value"
                role="radio"
                @click="setMode(option.value)"
            >
                {{ option.label }}
            </button>
        </div>

        <div v-if="mode === 'manual'" class="rec-inputs">
            <BaseInput
                id="palaver-book-rec-title-input"
                v-model="title"
                @update:modelValue="onRecTitleChange"
                label="title"
                placeholder="book title"
                :size="mobile ? 'small' : 'medium'"
            />
            <BaseInput
                id="palaver-book-rec-author-input"
                v-model="author"
                @update:modelValue="onRecAuthorChange"
                label="author"
                placeholder="book author"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>

        <div v-else-if="mode === 'search'" class="picker-panel">
            <TitleSearchRow
                v-model="searchQuery"
                mode="add"
                titleLabel="search by title"
                placeholder="book title"
                @clear="clearSearch"
            />
            <SearchStatePanel
                v-if="!selectedRecommendation"
                :loading="searching"
                :results="searchResults"
                :selectedResultId="selectedSearchResultId"
                title="pick the right rec, bro:"
                :manualMode="false"
                @select="selectBook($event, 'search')"
            />
        </div>

        <div v-else class="picker-panel">
            <div v-if="hasShelfBooks" class="shelf-groups">
                <section
                    v-for="group in shelfGroups"
                    :key="group.id"
                    class="shelf-group"
                >
                    <p class="shelf-title">{{ group.label }}</p>
                    <div class="books-grid">
                        <BookListItem
                            v-for="book in group.books"
                            :key="book.id"
                            :book="book"
                            :selectable="true"
                            :selected="
                                selectedRecommendation?.book?.id === book.id
                            "
                            @click="selectBook($event, 'shelves')"
                        />
                    </div>
                </section>
            </div>
            <div v-else class="empty-shelves">
                <p>no shelf books to recommend yet, tragic stuff</p>
            </div>
        </div>

        <div v-if="selectedRecommendation" class="selected-book">
            <div>
                <p class="selected-label">selected book</p>
                <p class="selected-title">
                    {{ selectedRecommendation.title }}
                    <span>by {{ selectedRecommendation.author }}</span>
                </p>
            </div>
            <BaseButton
                size="xsmall"
                variant="outline-secondary"
                @click="clearSelection"
            >
                change
            </BaseButton>
        </div>

        <TagPickerTrigger
            v-model="tagsProxy"
            label="tags (required)"
            variant="drawer"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import BaseInput from "@/components/form/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";
import TitleSearchRow from "@/components/form/BookForm/TitleSearchRow.vue";
import SearchStatePanel from "@/components/form/BookForm/SearchStatePanel.vue";
import BookListItem from "@/components/features/UserProfile/UserInfo/FavoritesStuff/BookListItem.vue";
import { useBooks } from "@/composables/useBooks";
import { useUserStore } from "@/stores/user";
import type { BookshelfBook } from "@/types";
import type { BookFormSearchResult } from "@/components/form/BookForm/types";

const { mobile } = useDisplay();
const { searchGoogleByTitle } = useBooks();
const { loggedInUser } = useUserStore();

type RecommendationInputMode = "manual" | "search" | "shelves";

type RecommendationSelection = {
    title: string;
    author: string;
    tags: string[];
    source: RecommendationInputMode;
    book?: BookshelfBook;
};

const modeOptions: Array<{ value: RecommendationInputMode; label: string }> = [
    { value: "search", label: "search" },
    { value: "shelves", label: "shelves" },
    { value: "manual", label: "manual" },
];

const props = defineProps<{
    modelValue: string[];
    recTitle: string;
    recAuthor: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
    (e: "update:recTitle", value: string): void;
    (e: "update:recAuthor", value: string): void;
}>();

const title = ref(props.recTitle);
const author = ref(props.recAuthor);
const mode = ref<RecommendationInputMode>("search");
const searchQuery = ref("");
const searchResults = ref<BookFormSearchResult[]>([]);
const searching = ref(false);
const selectedRecommendation = ref<RecommendationSelection | null>(null);
const selectedSearchResultId = ref<string | null>(null);
let searchTimer: number | null = null;

const tagsProxy = computed<string[]>({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

const shelfGroups = computed(() =>
    [
        {
            id: "haveRead",
            label: "have read",
            books: loggedInUser.haveRead || [],
        },
        {
            id: "currentlyReading",
            label: "currently reading",
            books: loggedInUser.currentlyReading || [],
        },
        {
            id: "wantToRead",
            label: "want to read",
            books: loggedInUser.wantToRead || [],
        },
    ].filter((group) => group.books.length > 0)
);

const hasShelfBooks = computed(() =>
    shelfGroups.value.some((group) => group.books.length > 0)
);

const onRecTitleChange = (value: string) => {
    title.value = value;
    selectedRecommendation.value = null;
    emit("update:recTitle", value);
};
const onRecAuthorChange = (value: string) => {
    author.value = value;
    selectedRecommendation.value = null;
    emit("update:recAuthor", value);
};

const emitRecommendationSelection = (selection: RecommendationSelection) => {
    selectedRecommendation.value = selection;
    title.value = selection.title;
    author.value = selection.author;
    emit("update:recTitle", selection.title);
    emit("update:recAuthor", selection.author);
    emit("update:modelValue", selection.tags);
};

const selectBook = (
    book: BookshelfBook | BookFormSearchResult,
    source: Exclude<RecommendationInputMode, "manual">
) => {
    selectedSearchResultId.value = source === "search" ? book.id : null;
    emitRecommendationSelection({
        title: book.title,
        author: book.author,
        tags: book.tags || [],
        source,
        book: book as BookshelfBook,
    });
};

const clearRecommendationFields = () => {
    title.value = "";
    author.value = "";
    emit("update:recTitle", "");
    emit("update:recAuthor", "");
    emit("update:modelValue", []);
};

const clearSearchState = () => {
    searchQuery.value = "";
    searchResults.value = [];
    selectedSearchResultId.value = null;
    if (searchTimer) window.clearTimeout(searchTimer);
};

const clearSearch = () => {
    clearSearchState();
    clearSelection();
};

const clearSelection = () => {
    selectedRecommendation.value = null;
    selectedSearchResultId.value = null;
    clearRecommendationFields();
};

const setMode = (nextMode: RecommendationInputMode) => {
    if (mode.value === nextMode) return;
    mode.value = nextMode;
    clearSearchState();
    if (nextMode !== "manual") {
        clearSelection();
    } else {
        selectedRecommendation.value = null;
    }
};

const runSearch = async () => {
    const query = searchQuery.value.trim();
    if (!query) {
        searchResults.value = [];
        selectedSearchResultId.value = null;
        return;
    }

    try {
        searching.value = true;
        searchResults.value = await searchGoogleByTitle(query);
        selectedSearchResultId.value = null;
    } catch {
        searchResults.value = [];
        selectedSearchResultId.value = null;
    } finally {
        searching.value = false;
    }
};

watch(
    () => searchQuery.value,
    () => {
        if (mode.value !== "search" || selectedRecommendation.value) return;
        if (searchTimer) window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(runSearch, 600);
    }
);

watch(
    () => props.recTitle,
    (value) => {
        title.value = value;
    }
);

watch(
    () => props.recAuthor,
    (value) => {
        author.value = value;
    }
);

onBeforeUnmount(() => {
    if (searchTimer) window.clearTimeout(searchTimer);
});
</script>

<style scoped>
.rec-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.mode-selector {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--accent-blue);
}

.mode-button {
    flex: 1;
    padding: 0.65rem 0.75rem;
    border: none;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: var(--text-muted);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.mode-button:hover,
.mode-button.active {
    color: var(--accent-blue);
    background: color-mix(in srgb, var(--accent-blue) 5%, transparent);
}

.mode-button.active {
    border-bottom-color: var(--accent-blue);
}

.rec-inputs {
    display: flex;
    gap: 0.5rem;
    width: 100%;
}

.picker-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.selected-book {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--accent-green);
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--accent-green) 8%, transparent);
}

.selected-label,
.selected-title {
    margin: 0;
}

.selected-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.selected-title {
    color: var(--main-text);
    font-weight: 600;
}

.selected-title span {
    color: var(--accent-green);
    font-weight: 400;
}

.shelf-groups {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 0.25rem;
}

.shelf-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.shelf-title {
    margin: 0;
    color: var(--accent-blue);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.books-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
}

.empty-shelves {
    padding: 2rem;
    text-align: center;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    color: var(--text-muted);
}

@media (max-width: 768px) {
    .rec-fields {
        gap: 0.75rem;
    }
    .rec-inputs {
        flex-direction: column;
        gap: 0.5rem;
    }
    .mode-button {
        padding: 0.55rem 0.5rem;
        font-size: 0.9rem;
    }
    .selected-book {
        align-items: flex-start;
        flex-direction: column;
    }
    .books-grid {
        grid-template-columns: 1fr;
    }
}
</style>
