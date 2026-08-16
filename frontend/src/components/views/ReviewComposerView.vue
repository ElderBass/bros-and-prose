<template>
    <AppLayout>
        <div class="review-composer-view">
            <PageHeader title="review this thing" :fallback-to="returnTo" />

            <LoadingSpinnerContainer
                v-if="loading"
                size="large"
                message="finding the book you allegedly read..."
            />

            <div v-else-if="book" class="composer-wrap">
                <div class="review-summary-row">
                    <section class="book-context">
                        <h1>{{ book.title }}</h1>
                        <p class="author">by {{ book.author }}</p>
                    </section>

                    <div class="rating-row">
                        <BookRatingInput v-model="rating" size="medium">
                            <template #header-action>
                                <FavoriteToggle
                                    :is-favorited="isFavorited"
                                    size="supersmall"
                                    @toggle="isFavorited = !isFavorited"
                                />
                            </template>
                        </BookRatingInput>
                    </div>
                </div>

                <div class="field">
                    <label for="review-body">review</label>
                    <p class="format-hint">
                        markdown supports <strong>bold</strong>,
                        <em>italic</em>, links, and line breaks.
                    </p>
                    <CommonComposerEditor
                        v-model="reviewComment"
                        placeholder="remember that brevity is the soul of wit, you twat..."
                        :autosave-label="autosaveLabel"
                    />
                </div>

                <ComposerActions
                    :validation-message="validationMessage"
                    :draft-restored="draftRestored"
                    :word-count="wordCount"
                    :char-count="charCount"
                    :submit-disabled="submitDisabled"
                    :submitting="submitting"
                    :is-edit="isEdit"
                    @cancel="onCancel"
                    @submit="onSubmit"
                />
            </div>

            <div v-else class="error-state">
                <p class="error-title">couldn't find that book, bud.</p>
                <BaseButton
                    variant="outline-secondary"
                    size="small"
                    :showTooltip="false"
                    @click="onCancel"
                >
                    go back
                </BaseButton>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import FavoriteToggle from "@/components/form/BookForm/FavoriteToggle.vue";
import CommonComposerEditor from "@/components/features/Composer/CommonComposerEditor.vue";
import ComposerActions from "@/components/features/Prose/Composer/ComposerActions.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import {
    DEFAULT_REVIEW,
    SAVED_BOOK_CLUB_BOOK_SUCCESS_ALERT,
} from "@/constants";
import { useBooks } from "@/composables/useBooks";
import { useUser } from "@/composables/useUser";
import { useUserFavorites } from "@/composables/useUserFavorites";
import { useUserShelves } from "@/composables/useUserShelves";
import { useBooksStore } from "@/stores/books";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import type { Book, BookshelfBook, SubmitReviewArgs } from "@/types";
import {
    clearBookReviewDraft,
    getBookReviewDraft,
    getFavoriteBooks,
    isBookFavorite,
    setBookReviewDraft,
} from "@/utils";

type ReviewableBook = Book | BookshelfBook;

const route = useRoute();
const router = useRouter();
const booksStore = useBooksStore();
const { loggedInUser } = storeToRefs(useUserStore());
const { addReview, clearUnfinishedReview, saveUnfinishedReview } = useUser();
const { getCurrentBook, getPastBook } = useBooks();
const { addCurrentBookClubBookToHaveRead } = useUserShelves();
const { updateFavorite } = useUserFavorites();
const { showAlert } = useUIStore();

const loading = ref(true);
const initializing = ref(true);
const book = ref<ReviewableBook | null>(null);
const rating = ref(DEFAULT_REVIEW.rating);
const reviewComment = ref(DEFAULT_REVIEW.reviewComment);
const draftRestored = ref(false);
const lastSavedAt = ref("");
const submitting = ref(false);
const isFavorited = ref(false);

let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const bookId = computed(() => String(route.params.bookId || ""));
const isEdit = computed(() =>
    Boolean(loggedInUser.value?.reviews?.[bookId.value])
);

const returnTo = computed(() => {
    const requested = route.query.returnTo;
    if (typeof requested === "string" && requested.startsWith("/")) {
        return requested;
    }
    if (route.query.source === "current") return "/present";
    if (bookId.value) return `/past/${bookId.value}`;
    return "/profile";
});

const currentUserId = computed(() => loggedInUser.value?.id ?? "");

const validationMessage = computed(() => {
    if (!rating.value || rating.value < 1 || rating.value > 10) {
        return "pick a rating between 1 and 10";
    }
    return "";
});

const submitDisabled = computed(() => Boolean(validationMessage.value));

const wordCount = computed(() => {
    const text = reviewComment.value.replace(/\u00A0/g, " ").trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
});

const charCount = computed(() => reviewComment.value.trim().length);

const lastSavedLabel = computed(() => {
    if (!lastSavedAt.value) return "";
    try {
        return new Date(lastSavedAt.value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return lastSavedAt.value;
    }
});

const autosaveLabel = computed(() =>
    lastSavedLabel.value ? `review draft saved ${lastSavedLabel.value}` : ""
);

const isCurrentBookReview = computed(
    () => book.value?.id === booksStore.currentBook?.id
);

const getShelfBooks = () => [
    ...(loggedInUser.value?.currentlyReading || []),
    ...(loggedInUser.value?.wantToRead || []),
    ...(loggedInUser.value?.haveRead || []),
];

const findStoredBook = () => {
    const allBooks = [booksStore.currentBook, ...booksStore.pastBooks].filter(
        (candidate) => candidate?.id
    );
    return (
        allBooks.find((candidate) => candidate.id === bookId.value) ||
        getShelfBooks().find((candidate) => candidate.id === bookId.value) ||
        null
    );
};

const toBookshelfBook = (reviewableBook: ReviewableBook): BookshelfBook => ({
    id: reviewableBook.id,
    title: reviewableBook.title,
    author: reviewableBook.author,
    imageSrc: "imageSrc" in reviewableBook ? reviewableBook.imageSrc : "",
    description:
        "description" in reviewableBook ? reviewableBook.description : "",
    yearPublished:
        "yearPublished" in reviewableBook ? reviewableBook.yearPublished : "",
    pages:
        "pages" in reviewableBook
            ? reviewableBook.pages
            : "totalPages" in reviewableBook
              ? reviewableBook.totalPages
              : 0,
    tags: "tags" in reviewableBook ? reviewableBook.tags : [],
});

const getReviewArgs = (): SubmitReviewArgs => ({
    rating: rating.value,
    reviewComment: reviewComment.value.trimEnd(),
});

const hasMeaningfulDraft = () =>
    reviewComment.value.trim().length > 0 ||
    rating.value !== DEFAULT_REVIEW.rating;

const persistDraft = async () => {
    if (!book.value || submitting.value) return;

    if (!hasMeaningfulDraft()) {
        if (
            currentUserId.value &&
            loggedInUser.value?.unfinishedReviews?.[book.value.id]
        ) {
            await clearUnfinishedReview(book.value.id);
        }
        if (currentUserId.value) {
            clearBookReviewDraft(book.value.id, currentUserId.value);
        }
        lastSavedAt.value = "";
        return;
    }

    const savedAt = new Date().toISOString();
    const draft = {
        ...getReviewArgs(),
        savedAt,
    };

    if (currentUserId.value) {
        setBookReviewDraft(book.value.id, currentUserId.value, draft);
        try {
            await saveUnfinishedReview(getReviewArgs(), book.value);
        } catch (error) {
            console.error("failed to sync review draft", error);
        }
    }
    lastSavedAt.value = savedAt;
};

watch([rating, reviewComment], () => {
    if (initializing.value) return;
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => {
        void persistDraft();
    }, 700);
});

const initializeDraft = () => {
    if (!book.value || !bookId.value) return;

    const existingReview = loggedInUser.value?.reviews?.[bookId.value];
    if (existingReview) {
        rating.value = existingReview.rating;
        reviewComment.value = existingReview.reviewComment;
        draftRestored.value = false;
        lastSavedAt.value = "";
        return;
    }

    const serverDraft = loggedInUser.value?.unfinishedReviews?.[bookId.value];
    if (serverDraft) {
        rating.value = serverDraft.rating;
        reviewComment.value = serverDraft.reviewComment;
        draftRestored.value = true;
        lastSavedAt.value = serverDraft.updatedAt ?? serverDraft.savedAt;
        return;
    }

    if (currentUserId.value) {
        const localDraft = getBookReviewDraft(
            bookId.value,
            currentUserId.value
        );
        if (localDraft) {
            rating.value = localDraft.rating;
            reviewComment.value = localDraft.reviewComment;
            draftRestored.value = true;
            lastSavedAt.value = localDraft.savedAt;
            return;
        }
    }

    rating.value = DEFAULT_REVIEW.rating;
    reviewComment.value = DEFAULT_REVIEW.reviewComment;
    draftRestored.value = false;
    lastSavedAt.value = "";
};

const loadBook = async () => {
    const storedBook = findStoredBook();
    if (storedBook) {
        book.value = storedBook;
        return;
    }

    const currentBook = booksStore.currentBook?.id
        ? booksStore.currentBook
        : await getCurrentBook();
    if (currentBook?.id === bookId.value) {
        book.value = currentBook;
        return;
    }

    const pastBook = await getPastBook(bookId.value);
    book.value = pastBook || null;
};

const persistFavorite = async () => {
    if (!book.value) return;
    const favorites = getFavoriteBooks();
    const withoutBook = favorites.filter(
        (favorite) => favorite.id !== book.value?.id
    );
    const updatedFavorites = isFavorited.value
        ? [...withoutBook, toBookshelfBook(book.value)]
        : withoutBook;
    await updateFavorite("books", updatedFavorites);
};

const onCancel = () => {
    router.push(returnTo.value);
};

const onSubmit = async () => {
    if (!book.value || submitDisabled.value) return;
    submitting.value = true;
    try {
        const updatedUser = await addReview(getReviewArgs(), book.value);
        if (!updatedUser) return;

        await persistFavorite();
        await clearUnfinishedReview(book.value.id);
        if (currentUserId.value) {
            clearBookReviewDraft(book.value.id, currentUserId.value);
        }

        if (isCurrentBookReview.value && "totalPages" in book.value) {
            await addCurrentBookClubBookToHaveRead(book.value, []);
            showAlert(SAVED_BOOK_CLUB_BOOK_SUCCESS_ALERT);
        }

        router.push(returnTo.value);
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    loading.value = true;
    initializing.value = true;
    try {
        await loadBook();
        initializeDraft();
        isFavorited.value = book.value ? isBookFavorite(book.value.id) : false;
    } finally {
        initializing.value = false;
        loading.value = false;
    }
});

onBeforeUnmount(() => {
    if (draftSaveTimeout) {
        clearTimeout(draftSaveTimeout);
        draftSaveTimeout = null;
    }
});
</script>

<style scoped>
.review-composer-view {
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
}

.composer-wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.review-summary-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.book-context {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0.25rem;
    gap: 0.25rem;
    text-align: center;
}

.author {
    margin: 0;
    color: var(--main-text);
    opacity: 0.82;
}

h1 {
    margin: 0;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-size: 2.35rem;
    font-style: italic;
    line-height: 1.1;
}

.author {
    color: var(--accent-lavender);
    font-family: "Libre Baskerville", serif;
    font-size: 1.45rem;
}

.rating-row {
    order: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-width: 260px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

label {
    color: var(--accent-blue);
    font-size: 1.1rem;
    padding-left: 0.35rem;
}

.format-hint {
    margin: 0 0 0.15rem;
    padding: 0 0.35rem;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--main-text);
    opacity: 0.78;
}

.format-hint strong {
    font-weight: 600;
    color: var(--accent-lavender);
}

.error-state {
    width: 100%;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.error-title {
    margin: 0;
    color: var(--accent-fuschia);
    font-size: 1.2rem;
}

@media (max-width: 768px) {
    .review-summary-row {
        align-items: stretch;
        flex-direction: column;
        gap: 1rem;
    }

    .book-context {
        order: 1;
    }

    .rating-row {
        order: 2;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.65rem;
        min-width: 0;
    }

    h1 {
        font-size: 1.8rem;
    }

    .author {
        font-size: 1.15rem;
    }
}
</style>
