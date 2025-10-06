<template>
    <form class="large-column" @submit.prevent="submit">
        <div class="column">
            <h3>add a future book</h3>
        </div>
        <div class="title-container">
            <img
                v-if="bookResult?.cover_i"
                :src="bookResult?.cover_i?.toString()"
                alt="book cover"
            />
            <div v-else class="placeholder-image">
                <FontAwesomeIcon :icon="faBook" />
            </div>
            <div class="form-container">
                <label for="title">first enter the title</label>
                <BaseInput
                    v-model="title"
                    label="title"
                    size="large"
                    placeholder="title"
                />
            </div>
        </div>

        <div v-if="showBookDetails" class="large-column">
            <div class="form-container">
                <BaseInput
                    v-model="author"
                    label="author"
                    size="medium"
                    placeholder="author"
                />
            </div>
            <div class="form-container">
                <BaseInput
                    v-model="image"
                    label="image"
                    size="medium"
                    placeholder="image"
                />
            </div>
            <div class="form-container">
                <BaseInput
                    v-model="description"
                    label="description"
                    size="medium"
                    placeholder="give this guy a little blurb for your bros"
                />
            </div>
            <div class="form-container">
                <BaseInput
                    v-model="yearPublished"
                    label="year published"
                    placeholder="year published"
                />
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { FutureBook, OpenLibraryBookResult } from "@/types";
import { useBooks } from "@/composables/useBooks";
import { onBeforeUnmount, ref, watch } from "vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useLog } from "@/composables/useLog";
import { QUICK_ERROR } from "@/constants";
import { useUIStore } from "@/stores/ui";

const { showAlert } = useUIStore();

defineProps<{
    onSubmit: (futureBook: FutureBook) => Promise<void>;
}>();

const { searchBooksByTitle } = useBooks();

const title = ref("");
const author = ref("");
const yearPublished = ref("");
const description = ref("");
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

const runSearch = async () => {
    const query = title.value.trim();
    if (!query) {
        bookResult.value = null;
        return;
    }
    try {
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
        await useLog().error(`Error in runSearch for future book form: ${e}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happend: ",
                (e as Error).message,
            ])
        );
        // optional: surface an error state here
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
.large-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.title-container {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.placeholder-image {
    width: 200px;
    height: 300px;
    background-color: var(--background-color);
    border-radius: 0.5rem;
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
