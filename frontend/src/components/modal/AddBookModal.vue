<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="add a book, bro"
        size="large"
    >
        <div class="content">
            <div class="search-row">
                <BaseInput
                    v-model="query"
                    label="search by title"
                    placeholder="type a title..."
                    type="text"
                    :size="isMobile ? 'medium' : 'large'"
                    :style="{ width: '100%' }"
                />
                <BaseButton
                    variant="outline"
                    :size="isMobile ? 'small' : 'medium'"
                    :disabled="isSearching || !queryTrimmed"
                    @click="runSearch"
                >
                    <span v-if="!isMobile">{{
                        isSearching ? "searching..." : "search"
                    }}</span>
                    <span v-else
                        ><FontAwesomeIcon
                            :icon="isSearching ? faSpinner : faSearch"
                    /></span>
                </BaseButton>
            </div>

            <v-expand-transition>
                <div class="results" v-if="results.length">
                    <div class="results-grid">
                        <BookSearchResult
                            v-for="b in mappedResults"
                            :key="b.key"
                            :book="b as IBookSearchResult"
                            :onSelect="selectBook"
                            :isSelected="isSelected(b)"
                        />
                    </div>
                </div>
                <div v-if="!results.length" class="empty">
                    <p>search results will appear here</p>
                </div>
            </v-expand-transition>

            <v-expand-transition>
                <div v-if="selectedBooks.length" class="actions">
                    <BaseButton
                        :size="isMobile ? 'small' : 'medium'"
                        variant="outline"
                        @click="selectedBooks = []"
                    >
                        confirm selection(s)
                    </BaseButton>
                </div>
            </v-expand-transition>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useBooks } from "@/composables/useBooks";
import BookSearchResult from "../features/UserProfile/BookSearchResult.vue";
import type { IBookSearchResult, BookResult } from "@/types";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { faSpinner, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const emit = defineEmits<{
    (e: "close"): void;
}>();

defineProps<{
    open: boolean;
}>();

const { isMobile } = storeToRefs(useUIStore());

const { searchBooksByTitle } = useBooks();

const query = ref("");
const results = ref<BookResult[]>([]);
const isSearching = ref(false);
const selectedBooks = ref<IBookSearchResult[]>([]);
const queryTrimmed = computed(() => query.value.trim().length > 0);

const runSearch = async () => {
    if (!queryTrimmed.value) return;
    try {
        isSearching.value = true;
        const docs = await searchBooksByTitle(query.value.trim());
        results.value = Array.isArray(docs) ? docs : [];
    } finally {
        isSearching.value = false;
    }
};

const imageFor = (doc: BookResult) => {
    if (doc.cover_i)
        return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    if (doc.isbn?.length)
        return `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-M.jpg`;
    return "";
};

const mappedResults = computed(
    () =>
        results.value.slice(0, 24).map((doc: BookResult) => ({
            key:
                doc.key ??
                doc.cover_edition_key ??
                `${doc.title}-${doc.first_publish_year}`,
            title: doc.title,
            author: (doc.author_name && doc.author_name[0]) || "unknown",
            yearPublished: doc.first_publish_year ?? null,
            imageSrc: imageFor(doc),
            raw: doc,
        })) as IBookSearchResult[]
);

const selectBook = (book: IBookSearchResult) => {
    console.log("selectBook", book);
    if (isSelected(book)) {
        selectedBooks.value = selectedBooks.value.filter(
            (b) => b.key !== book.key
        );
    } else {
        selectedBooks.value.push(book);
    }
};
const onClose = () => emit("close");

const isSelected = (book: IBookSearchResult) => {
    return selectedBooks.value.some((b) => b.key === book.key);
};
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.results {
    margin-top: 0.5rem;
    padding: 1.5rem;
    border-radius: 0.5rem;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
}

.empty {
    opacity: 0.7;
    text-align: center;
    padding: 1rem 0;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    align-self: end;
    width: 75%;
}
</style>
