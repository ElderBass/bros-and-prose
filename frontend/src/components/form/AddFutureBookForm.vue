<template>
    <form @submit.prevent="submit">
        <div class="column">
            <div class="image-container">
                <img
                    v-if="bookResult?.cover_i && !isLoading"
                    :src="imageSrc"
                    alt="book cover"
                />
                <LoadingSpinner
                    v-else-if="isLoading"
                    size="medium"
                    message="gathering image..."
                />
                <div v-else class="placeholder-image">
                    <FontAwesomeIcon :icon="faBook" />
                </div>
            </div>
        </div>
        <div class="inputs-container">
            <div class="form-container">
                <label for="future-book-title" class="title-label"
                    >gimme the title</label
                >
                <BaseInput
                    v-model="title"
                    id="future-book-title"
                    label="title"
                    size="large"
                    placeholder="title"
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
                        />
                    </div>
                </div>
                <div class="form-container">
                    <label for="future-book-description" class="label"
                        >description</label
                    >
                    <BaseTextArea
                        v-model="description"
                        id="future-book-description"
                        label="description"
                        placeholder="give this guy a little blurb for your bros"
                        style="height: 100%"
                    />
                </div>
                <div
                    v-if="showBookDetails && !isLoading"
                    class="tags-container"
                >
                    <BookTag
                        v-for="tag in COMMON_BOOK_TAGS"
                        :key="tag"
                        :tag="tag"
                        :selected="tags.includes(tag)"
                        :onClick="() => toggleTag(tag)"
                    />
                </div>
            </template>
            <div v-if="!showBookDetails && !isLoading" class="no-book-details">
                <p>enter a title and we'll find the rest</p>
            </div>
            <div v-if="showBookDetails && !isLoading" class="form-actions">
                <BaseButton variant="outline" @click="closeModal">
                    cancel
                </BaseButton>
                <BaseButton
                    :disabled="!canSubmit"
                    variant="outline"
                    type="submit"
                >
                    submit
                </BaseButton>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { FutureBook, OpenLibraryBookResult } from "@/types";
import { useBooks } from "@/composables/useBooks";
import { onBeforeUnmount, ref, watch, computed } from "vue";
import BookTag from "@/components/ui/BookTag.vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useLog } from "@/composables/useLog";
import { COMMON_BOOK_TAGS, QUICK_ERROR } from "@/constants";
import { useUIStore } from "@/stores/ui";

const { showAlert } = useUIStore();

defineProps<{
    onSubmit: (futureBook: FutureBook) => Promise<void>;
    closeModal: () => void;
}>();

const { searchBooksByTitle } = useBooks();

const isLoading = ref(false);
const title = ref("");
const author = ref("");
const yearPublished = ref("");
const description = ref("");
const tags = ref<string[]>([]);
const image = ref("");
const bookResult = ref<OpenLibraryBookResult | null>(null);
const showBookDetails = ref(false);

const submit = async () => {
    // const futureBook = {
    //     id: uuid(),
    //     title: title.value,
    //     author: author.value,
    //     description: description.value,
    //     image: image.value,
    //     yearPublished: yearPublished.value,
    //     imageSrc: imageSrc.value,
    //     votes: votes.value,
    // };
    // await props.onSubmit(futureBook);
};

const toggleTag = (tag: string) => {
    if (tags.value.includes(tag)) {
        tags.value = tags.value.filter((t) => t !== tag);
    } else {
        tags.value.push(tag);
    }
};

const runSearch = async () => {
    const query = title.value.trim();
    if (!query) {
        bookResult.value = null;
        return;
    }
    try {
        isLoading.value = true;
        const books = await searchBooksByTitle(query);
        bookResult.value = (books && books[0]) || null;
        if (bookResult.value) {
            showBookDetails.value = true;
            author.value = bookResult.value.author_name[0];
            yearPublished.value =
                bookResult.value.first_publish_year.toString();
            image.value = bookResult.value.cover_i.toString();
        }
    } catch (e) {
        bookResult.value = null;
        console.error("error in runSearch for future book form", e);
        await useLog().error(`Error in runSearch for future book form: ${e}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happend: ",
                (e as Error).message,
            ])
        );
        // optional: surface an error state here
    } finally {
        isLoading.value = false;
    }
};

const imageSrc = computed(() => {
    return `https://covers.openlibrary.org/b/id/${bookResult.value?.cover_i}-M.jpg`;
});

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
</script>

<style scoped>
form {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.column {
    flex: 1 0 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    min-height: 640px;
}

.image-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
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
    gap: 1rem;
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
    height: 100%;
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
</style>
