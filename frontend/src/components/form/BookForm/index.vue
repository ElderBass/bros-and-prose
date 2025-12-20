<template>
    <form class="form" @submit.prevent="handleSubmit">
        <TitleSearchRow
            v-model="title"
            :inputId="ids.title"
            :titleLabel="titleLabel"
            :noResults="manualMode"
            :placeholder="titlePlaceholder"
            :disabled="isEditMode"
            @clear="resetAll"
        />

        <SearchStatePanel
            v-if="showSearchStatePanel"
            :loading="loading"
            :showResults="showResults"
            :showEmpty="showEmptyPanel"
        >
            <template #loading>
                <slot name="loading">
                    <SearchSkeletonLoader />
                </slot>
            </template>

            <template #results>
                <ResultsList
                    :results="results"
                    :selectedResultId="selectedResult?.id ?? null"
                    :title="resultsTitle"
                    @select="onSelectResult"
                />
            </template>
        </SearchStatePanel>

        <template v-if="detailsVisible && !loading">
            <BookDetailsFields
                :mode="mode"
                :isEdit="isEditMode"
                :author="author"
                :yearPublished="yearPublished"
                :pages="pages"
                :tags="tags"
                :description="description"
                :tagsLabel="tagsLabel"
                :idPrefix="ids.prefix"
                @update:author="author = $event"
                @update:yearPublished="yearPublished = $event"
                @update:pages="pages = $event"
                @update:tags="tags = $event"
                @update:description="description = $event"
            />
        </template>

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
import SearchSkeletonLoader from "./SearchSkeletonLoader.vue";
import TitleSearchRow from "./TitleSearchRow.vue";
import SearchStatePanel from "./SearchStatePanel.vue";
import ResultsList from "./ResultsList.vue";
import BookDetailsFields from "./BookDetailsFields.vue";
import type {
    BookFormMode,
    BookFormSearchResult,
    BookFormValidation,
    BookFormValues,
} from "./types";
import { useBooks } from "@/composables/useBooks";

defineOptions({ name: "BookForm" });

const props = withDefaults(
    defineProps<{
        mode: BookFormMode;
        titleLabel: string;
        titlePlaceholder?: string;
        resultsTitle?: string;
        tagsLabel?: string;
        initialValues?: Partial<BookFormValues>;
        validation?: BookFormValidation;
        mapResultToValues?: (
            r: BookFormSearchResult
        ) => Partial<BookFormValues>;
        onSubmit: (values: BookFormValues) => Promise<void>;
        dirtyKeys?: Array<keyof BookFormValues>;
    }>(),
    {
        titlePlaceholder: "book title",
        tagsLabel: undefined,
        initialValues: () => ({}),
        validation: undefined,
        mapResultToValues: undefined,
        dirtyKeys: () => ["tags", "description", "pages"],
    }
);

const emit = defineEmits<{
    (e: "submitted"): void;
}>();

// Form state
const title = ref(props.initialValues?.title ?? "");
const author = ref(props.initialValues?.author ?? "");
const yearPublished = ref(props.initialValues?.yearPublished ?? "");
const pages = ref<number | undefined>(props.initialValues?.pages);
const tags = ref<string[]>(props.initialValues?.tags ?? []);
const description = ref(props.initialValues?.description ?? "");
const imageSrc = ref<string | undefined>(props.initialValues?.imageSrc);

const loading = ref(false);
const results = ref<BookFormSearchResult[]>([]);
const selectedResult = ref<BookFormSearchResult | null>(null);
const manualMode = ref(false); // "no results" -> allow manual entry
const bookSelected = ref(false);

const { searchGoogleByTitle } = useBooks();

const ids = computed(() => ({
    prefix: `book-form-${props.mode}`,
    title: `book-form-${props.mode}-title`,
}));

const isEditMode = computed(() => {
    return props.mode === "edit" || props.mode === "future-edit";
});

const validationResolved = computed(() => {
    const defaults: Required<BookFormValidation> = {
        requireTitle: true,
        requireAuthor: true,
        requireYearPublished: true,
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

const showResults = computed(() => {
    return results.value.length > 0 && !selectedResult.value;
});

const showEmptyPanel = computed(() => {
    // Show the empty panel only when we're not showing results and not in manual mode.
    return !showResults.value && !manualMode.value && !selectedResult.value;
});

const showSearchStatePanel = computed(() => {
    if (props.mode === "edit" || props.mode === "future-edit") return false;
    if (bookSelected.value) return false;
    return true;
});

const values = computed<BookFormValues>(() => ({
    title: title.value.trim(),
    author: author.value.trim(),
    yearPublished: yearPublished.value.trim(),
    pages: pages.value,
    tags: tags.value,
    description: description.value,
    imageSrc: imageSrc.value,
}));

const canSubmit = computed(() => {
    if (isEditMode.value) return !isDirty.value;

    const v = validationResolved.value;
    if (v.requireTitle && !values.value.title) return false;
    if (v.requireAuthor && !values.value.author) return false;
    if (v.requireYearPublished && !values.value.yearPublished) return false;
    if (v.requireTags && values.value.tags.length === 0) return false;
    if (v.requireDescription && !values.value.description.trim()) return false;
    return true;
});

const isDirty = computed(() => {
    const initial: BookFormValues = {
        title: props.initialValues?.title ?? "",
        author: props.initialValues?.author ?? "",
        yearPublished: props.initialValues?.yearPublished ?? "",
        pages: props.initialValues?.pages,
        tags: props.initialValues?.tags ?? [],
        description: props.initialValues?.description ?? "",
        imageSrc: props.initialValues?.imageSrc,
    };
    return props.dirtyKeys.some((k) => {
        const a = (values.value as BookFormValues)[k];
        const b = (initial as BookFormValues)[k];
        return JSON.stringify(a) !== JSON.stringify(b);
    });
});

const resetAll = (resetResults = true) => {
    if (resetResults) {
        title.value = props.initialValues?.title ?? "";
        results.value = [];
    }

    author.value = props.initialValues?.author ?? "";
    yearPublished.value = props.initialValues?.yearPublished ?? "";
    pages.value = props.initialValues?.pages;
    tags.value = props.initialValues?.tags ?? [];
    description.value = props.initialValues?.description ?? "";
    imageSrc.value = props.initialValues?.imageSrc;

    selectedResult.value = null;
    manualMode.value = false;
    bookSelected.value = false;
};

const onSelectResult = (result: BookFormSearchResult) => {
    // Selecting a result will often update the title programmatically, which would
    // otherwise trigger the title watcher + runSearch again. Avoid that.
    bookSelected.value = true;
    selectedResult.value = result;
    manualMode.value = false;

    const mapped: Partial<BookFormValues> = props.mapResultToValues
        ? props.mapResultToValues(result)
        : {
              title: result.title || "",
              author: result.author || "",
              yearPublished: result.yearPublished
                  ? String(result.yearPublished)
                  : "",
              pages: result.pages,
              imageSrc: result.imageSrc || "",
              description: result.description || "",
          };

    title.value = mapped.title ?? title.value;
    author.value = mapped.author ?? author.value;
    yearPublished.value = mapped.yearPublished ?? yearPublished.value;
    pages.value =
        typeof mapped.pages !== "undefined" ? mapped.pages : pages.value;
    imageSrc.value = mapped.imageSrc ?? imageSrc.value;
    // Only prefill description if it is currently empty.
    if (!description.value.trim() && mapped.description) {
        description.value = mapped.description;
    }
};

const runSearch = async () => {
    if (isEditMode.value || Boolean(selectedResult.value)) return;

    const query = title.value.trim();
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
    title,
    () => {
        if (isEditMode.value) return;

        if (bookSelected.value) {
            return;
        }

        // If user edits title after picking a result, reset the picked state.
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
        const toSubmit = { ...values.value };
        // Preserve the old AddBook behavior: if user didn't type a blurb/comment,
        // fall back to the selected result's description (when available).
        if (
            !toSubmit.description?.trim() &&
            selectedResult.value?.description
        ) {
            toSubmit.description = selectedResult.value.description;
        }
        await props.onSubmit(toSubmit);
        emit("submitted");
    } finally {
        loading.value = false;
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
