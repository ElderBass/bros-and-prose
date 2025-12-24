<template>
    <form class="form" @submit.prevent="handleSubmit">
        <TitleSearchRow
            v-model="book.title"
            :mode="mode"
            :titleLabel="titleLabel"
            :noResults="manualMode"
            :disabled="isEditMode"
            @clear="resetAll"
        />

        <SearchStatePanel
            v-if="showSearchStatePanel"
            :loading="loading"
            :results="results"
            :selectedResultId="selectedResult?.id ?? null"
            :title="resultsTitle"
            :manualMode="manualMode"
            @select="onSelectResult"
        />

        <BookDetailsFields
            v-if="detailsVisible && !loading"
            :mode="mode"
            :isEdit="isEditMode"
            :book="book"
            :review="review"
            @update:review="review = $event"
            @update:book="book = $event"
        />

        <slot
            name="actions"
            :canSubmit="canSubmit"
            :loading="loading"
            :detailsVisible="detailsVisible"
            :back="() => resetAll(false)"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import TitleSearchRow from "./TitleSearchRow.vue";
import SearchStatePanel from "./SearchStatePanel.vue";
import BookDetailsFields from "./BookDetailsFields.vue";
import type {
    BookFormMode,
    BookFormSearchResult,
    BookFormValidation,
    BookFormValues,
} from "./types";
import { useBooks } from "@/composables/useBooks";
import type { BookshelfBook, FutureBook, SubmitReviewArgs } from "@/types";
import { DEFAULT_REVIEW } from "@/constants";
import { getInitialBookValues, showReviewForm } from "./utils";

defineOptions({ name: "BookForm" });

const props = withDefaults(
    defineProps<{
        mode: BookFormMode;
        titleLabel: string;
        resultsTitle?: string;
        initialValues?: Partial<BookFormValues>;
        validation?: BookFormValidation;
        onSubmit: (
            values: BookFormValues,
            review?: SubmitReviewArgs
        ) => Promise<void>;
        dirtyKeys?: Array<keyof BookFormValues>;
    }>(),
    {
        initialValues: () => ({}),
        validation: undefined,
        dirtyKeys: () => ["tags", "description", "pages"],
    }
);

const initialValuesResolved = getInitialBookValues(props.initialValues);

// Form state
const book = ref<BookshelfBook | FutureBook>(
    initialValuesResolved as BookshelfBook | FutureBook
);
const review = ref(DEFAULT_REVIEW);

const loading = ref(false);
const results = ref<BookFormSearchResult[]>([]);
const selectedResult = ref<BookFormSearchResult | null>(null);
const manualMode = ref(false); // "no results" -> allow manual entry
const bookSelected = ref(false);

const { searchGoogleByTitle } = useBooks();

const isEditMode = computed(() => {
    return props.mode === "edit" || props.mode === "future-edit";
});

const validationResolved = computed(() => {
    const defaults: Required<BookFormValidation> = {
        requireTags: props.mode === "future",
        requireDescription: props.mode === "future",
    };
    return {
        ...defaults,
        ...(props.validation ?? {}),
    };
});

const detailsVisible = computed(() => {
    if (isEditMode.value) return true;
    return Boolean(selectedResult.value) || manualMode.value;
});

const showSearchStatePanel = computed(() => {
    if (props.mode === "edit" || props.mode === "future-edit") return false;
    if (bookSelected.value) return false;
    return true;
});

const canSubmit = computed(() => {
    if (isEditMode.value) return !isDirty.value;

    const v = validationResolved.value;
    if (!book.value.title) return false;
    if (!book.value.author) return false;
    if (!book.value.yearPublished) return false;
    if (v.requireTags && book.value.tags?.length === 0) return false;
    if (v.requireDescription && !book.value.description?.trim()) return false;
    return true;
});

const isDirty = computed(() => {
    return props.dirtyKeys.some((k) => {
        const a = (book.value as BookFormValues)[k];
        const b = (initialValuesResolved as BookFormValues)[k];
        return JSON.stringify(a) !== JSON.stringify(b);
    });
});

const resetAll = (resetResults = true) => {
    if (resetResults) {
        book.value.title = "";
        results.value = [];
    }

    book.value = {
        ...initialValuesResolved,
        title: book.value.title,
    };

    selectedResult.value = null;
    manualMode.value = false;
    bookSelected.value = false;
};

const onSelectResult = (result: BookFormSearchResult) => {
    bookSelected.value = true;
    selectedResult.value = result;
    manualMode.value = false;

    const mapped: Partial<BookFormValues> = {
        title: result.title || "",
        author: result.author || "",
        yearPublished: result.yearPublished,
        pages: result.pages,
        imageSrc: result.imageSrc,
        description: result.description,
    };

    book.value = { ...book.value, ...mapped };
};

const runSearch = async () => {
    if (isEditMode.value || Boolean(selectedResult.value)) return;

    const query = book.value.title.trim();
    if (!query) {
        results.value = [];
        selectedResult.value = null;
        manualMode.value = false;
        return;
    }

    try {
        loading.value = true;
        const found = await searchGoogleByTitle(query);
        results.value = found || [];
        selectedResult.value = null;

        manualMode.value = results.value.length === 0;
    } catch {
        results.value = [];
        selectedResult.value = null;
        manualMode.value = true;
    } finally {
        loading.value = false;
    }
};

let searchTimer: number | null = null;

watch(
    () => book.value.title,
    () => {
        if (isEditMode.value) return;

        if (bookSelected.value) {
            return;
        }

        selectedResult.value = null;
        manualMode.value = false;

        if (searchTimer) window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
            runSearch();
        }, 900);
    },
    { flush: "post" }
);

onBeforeUnmount(() => {
    if (searchTimer) window.clearTimeout(searchTimer);
});

const handleSubmit = async () => {
    try {
        loading.value = true;
        const toSubmit = { ...book.value };

        if (showReviewForm(props.mode)) {
            await props.onSubmit(toSubmit, review.value);
        } else {
            await props.onSubmit(toSubmit, undefined);
        }
    } catch (error) {
        console.error("error in handleSubmit", error);
    }
};
</script>

<style scoped>
.form {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

@media (max-width: 768px) {
    .form {
        gap: 0.75rem;
    }
}
</style>
