<template>
    <AppLayout>
        <PageTitle title="take a closer look" />
        <div v-if="isLoading" class="spinner-container">
            <LoadingSpinner
                v-if="isLoading"
                size="large"
                message="retrieving the book..."
            />
        </div>
        <PastBookDetail
            v-else
            :book="book"
            :userReviews="userReviews"
            :aggregateRating="aggregateRating"
        />
        <AddCommentFab v-if="!isGuestUser()" @click="openAddCommentModal" />
        <AddCommentModal
            v-if="showAddCommentModal"
            :open="showAddCommentModal"
            @submit="handleSubmitComment"
            @close="showAddCommentModal = false"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import type { Book, BroReview, Comment } from "@/types";
import { useRoute } from "vue-router";
import { useBooks } from "@/composables/useBooks";
import {
    DISCUSSION_COMMENT_ADDED_SUCCESS_ALERT,
    QUICK_ERROR,
} from "@/constants";
import { useUIStore } from "@/stores/ui";
import PastBookDetail from "@/components/features/PastBooks/PastBookDetail.vue";
import AddCommentFab from "@/components/features/PastBooks/AddCommentFab.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import { buildPalaverEntry, getReviewsAndAverageRating } from "@/utils";
import { isGuestUser } from "@/utils";
import { useBooksStore } from "@/stores/books";
import { useLog, usePalaver } from "@/composables";

const { getPastBook } = useBooks();
const { createPalaverEntry } = usePalaver();
const { showAlert } = useUIStore();
const route = useRoute();

const book = ref<Book>({} as Book);
const userReviews = ref<BroReview[]>([]);
const aggregateRating = ref("");
const isLoading = ref(true);
const showAddCommentModal = ref(false);

const openAddCommentModal = () => {
    showAddCommentModal.value = true;
};

const loadBookData = async () => {
    isLoading.value = true;
    const bookId = route.params.bookId as string;
    let fetchedBook = useBooksStore().getPastBooks.find(
        (book: Book) => book.id === bookId
    ) as Book;
    if (!fetchedBook) {
        fetchedBook = await getPastBook(bookId);
    }

    book.value = fetchedBook;
    const { reviews, averageRating } =
        await getReviewsAndAverageRating(fetchedBook);
    userReviews.value = reviews;
    aggregateRating.value = averageRating;
    isLoading.value = false;
};

const handleSubmitComment = async (comment: Comment) => {
    isLoading.value = true;
    try {
        const entry = buildPalaverEntry({
            type: "discussion_note",
            text: comment.text,
            bookInfo: {
                title: book.value.title,
                id: book.value.id,
                author: book.value.author,
            },
        });
        await createPalaverEntry(entry);
        showAddCommentModal.value = false;
        showAlert(DISCUSSION_COMMENT_ADDED_SUCCESS_ALERT);
        await loadBookData();
    } catch (error) {
        console.error("Error submitting comment:", error);
        await useLog().error(`Error submitting comment: ${error}`);
        showAlert(
            QUICK_ERROR([
                "something fucked with submitting your comment: ",
                (error as Error).message ?? "unknown error",
            ])
        );
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    await loadBookData();
});

watch(
    () => route.params.bookId,
    async (newBookId, oldBookId) => {
        if (newBookId && newBookId !== oldBookId) {
            await loadBookData();
        }
    }
);
</script>

<style scoped>
.spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .book-detail-container {
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
