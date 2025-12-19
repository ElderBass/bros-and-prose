<template>
    <form @submit.prevent="submit">
        <div class="image-container">
            <img v-if="image && !isLoading" :src="image" alt="book cover" />
            <LoadingSpinner
                v-else-if="isLoading"
                size="medium"
                message="gathering image..."
            />
            <div v-else class="placeholder-image">
                <FontAwesomeIcon :icon="faBook" />
            </div>
        </div>
        <div class="inputs-container">
            <div class="form-container">
                <label
                    v-if="!noBookFound"
                    for="future-book-title"
                    class="title-label"
                    >gimme the title</label
                >
                <label v-else for="future-book-title" class="title-label">
                    shitty API didn't find it; do it yourself
                </label>
                <BaseInput
                    v-model="title"
                    id="future-book-title"
                    label="title"
                    size="medium"
                    placeholder="title"
                    :disabled="isEdit"
                />
            </div>
            <div v-if="isLoading" class="spinner-container">
                <LoadingSpinner
                    v-if="isLoading"
                    size="large"
                    message="retrieving the current prose, bros..."
                />
            </div>
            <template v-if="showBookDetails && !isLoading">
                <div class="form-row">
                    <div class="form-container">
                        <label for="future-book-author" class="label"
                            >author</label
                        >
                        <BaseInput
                            v-model="author"
                            id="future-book-author"
                            label="author"
                            size="medium"
                            placeholder="author"
                            :disabled="isEdit"
                        />
                    </div>
                    <div class="form-container">
                        <label for="future-book-year-published" class="label"
                            >year published</label
                        >
                        <BaseInput
                            v-model="yearPublished"
                            id="future-book-year-published"
                            label="year published"
                            placeholder="year published"
                            size="medium"
                            :disabled="isEdit"
                        />
                    </div>
                </div>
                <div class="form-container">
                    <label for="future-book-description" class="label"
                        >blurb</label
                    >
                    <BaseTextArea
                        v-model="description"
                        id="future-book-description"
                        label="description"
                        placeholder="give this guy a little blurb for your bros"
                        :style="{ height: '100%' }"
                    />
                </div>
                <TagPickerTrigger
                    v-if="showBookDetails && !isLoading"
                    v-model="tags"
                    label="tags (required)"
                    variant="drawer"
                />
            </template>
            <div v-if="!showBookDetails && !isLoading" class="no-book-details">
                <p>enter a title and we'll find the rest</p>
            </div>
            <div v-if="showBookDetails && !isLoading" class="form-actions">
                <BaseButton
                    variant="outline-secondary"
                    size="small"
                    title="good call because this bro looks hella lame, my dude."
                    @click="closeModal"
                    :style="{ width: isMobile ? '100%' : '50%' }"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    size="small"
                    :disabled="!canSubmit"
                    variant="primary"
                    type="submit"
                    title="I hope the bros don't shit on this too much, bro..."
                    :style="{ width: isMobile ? '100%' : '50%' }"
                >
                    submit
                </BaseButton>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch, computed, onMounted } from "vue";
import type { FutureBook, OpenLibraryBookResult } from "@/types";
import { QUICK_ERROR } from "@/constants";
import { v4 as uuid } from "uuid";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";
import { capitalizeBookTitle } from "@/utils";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useLog } from "@/composables/useLog";
import { useBooks } from "@/composables/useBooks";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { useFutureBooksStore } from "@/stores/futureBooks";

const { showAlert } = useUIStore();
const { isMobile } = storeToRefs(useUIStore());
const { modal } = storeToRefs(useFutureBooksStore());

const formModal = computed(() => {
    if (modal.value?.kind === "form" && modal.value.open) {
        return modal.value;
    }
    return null;
});

const props = defineProps<{
    onSubmit: (futureBook: FutureBook, isEdit: boolean) => Promise<void>;
    closeModal: () => void;
}>();

const { searchBooksByTitle } = useBooks();

const isLoading = ref(false);
const isEdit = ref(false);
const showBookDetails = ref(false);
const noBookFound = ref(false);

const title = ref("");
const author = ref("");
const yearPublished = ref("");
const description = ref("");
const tags = ref<string[]>([]);
const image = ref("");
const bookResult = ref<OpenLibraryBookResult>({} as OpenLibraryBookResult);

const submit = async () => {
    let futureBookToSubmit: FutureBook;
    if (isEdit.value && formModal.value?.futureBook) {
        futureBookToSubmit = {
            ...formModal.value.futureBook,
            description: description.value,
            tags: tags.value,
        };
    } else {
        futureBookToSubmit = {
            id: uuid(),
            title: capitalizeBookTitle(bookResult.value.title),
            author: author.value,
            description: description.value,
            yearPublished: parseInt(yearPublished.value),
            imageSrc: image.value,
            tags: tags.value,
            votes: ["placeholder"] as string[],
        };
    }
    await props.onSubmit(futureBookToSubmit, isEdit.value);
};

const runSearch = async () => {
    const query = title.value.trim();
    if (!query || isEdit.value) {
        bookResult.value = {} as OpenLibraryBookResult;
        return;
    }
    try {
        isLoading.value = true;
        const books = await searchBooksByTitle(query);
        bookResult.value = (books && books[0]) || {};

        if (bookResult.value.title && bookResult.value.author_name[0]) {
            showBookDetails.value = true;
            author.value = bookResult.value.author_name[0];
            yearPublished.value =
                bookResult.value.first_publish_year.toString();
            image.value = `https://covers.openlibrary.org/b/id/${bookResult.value.cover_i}-M.jpg`;
        } else {
            noBookFound.value = true;
            showBookDetails.value = true;
        }
    } catch (e) {
        bookResult.value = {} as OpenLibraryBookResult;
        console.error("error in runSearch for future book form", e);
        await useLog().error(`Error in runSearch for future book form: ${e}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happened: ",
                (e as Error).message,
            ])
        );
    } finally {
        isLoading.value = false;
    }
};

const canSubmit = computed(() => {
    return (
        title.value.trim().length > 0 &&
        tags.value.length > 0 &&
        description.value.trim().length > 0 &&
        author.value.trim().length > 0 &&
        yearPublished.value.trim().length > 0
    );
});

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

onMounted(() => {
    if (formModal.value?.futureBook?.id) {
        showBookDetails.value = true;
        isEdit.value = true;
        title.value = formModal.value.futureBook.title;
        author.value = formModal.value.futureBook.author;
        yearPublished.value =
            formModal.value.futureBook.yearPublished.toString();
        description.value = formModal.value.futureBook.description ?? "";
        tags.value = formModal.value.futureBook.tags ?? ([] as string[]);
        image.value = formModal.value.futureBook.imageSrc;
    }
});
</script>

<style scoped>
form {
    display: flex;
    gap: 1rem;
    width: 100%;
    min-height: 640px;
}

.image-container {
    flex: 1 0 33%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    width: 100%;
}

/* Ensure cover image scales nicely */
.image-container img {
    width: 100%;
    max-width: 360px;
    height: auto;
    border-radius: 0.75rem;
    margin: 0 auto;
}

.tags-container {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    min-height: 100px;
    width: 100%;
}

.inputs-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.form-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
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

.year-published-label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-fuschia);
    padding-left: 0.5rem;
}

.placeholder-image {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--accent-blue);
    background-color: var(--background-color);
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

.title-label {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-fuschia);
    padding-left: 0.5rem;
}

.no-book-details {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    height: 100%;
    min-height: 400px;
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

/* Mobile optimizations */
@media (max-width: 786px) {
    form {
        flex-direction: column; /* stack image and inputs */
        gap: 0.5rem;
    }

    .column {
        min-height: unset;
        padding: 0.5rem 0;
        order: 1; /* keep image toward top */
    }

    .image-container img {
        max-width: 260px;
        border-radius: 0.5rem;
    }

    .placeholder-image {
        min-height: 240px;
        font-size: 1.5rem;
    }

    .inputs-container {
        gap: 0.75rem;
        flex: 1 0 auto;
        justify-content: space-between;
    }

    .form-row {
        flex-direction: column; /* author and year on separate lines */
        gap: 0.75rem;
    }

    .form-actions {
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.25rem;
    }

    .tags-container {
        max-height: 160px;
        overflow-y: auto;
        padding-right: 0.25rem; /* room for scrollbar */
    }

    .title-label {
        font-size: 1.25rem;
    }

    .label {
        font-size: 1.1rem;
    }

    .no-book-details {
        min-height: 220px;
        font-size: 1.125rem;
        padding: 1rem;
    }

    /* Tame textarea height from BaseTextArea component */
    .form-container :deep(textarea) {
        min-height: 140px;
        max-height: 220px;
    }
}
</style>
