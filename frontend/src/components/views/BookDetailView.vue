<template>
    <AppLayout>
        <PageTitle title="take a closer look" />
        <div class="book-detail-container">
            <BaseCard shadowColor="blue" size="medium">
                <BookInfo :book="book" />
            </BaseCard>
            <BaseCard shadowColor="green" size="medium">
                <div class="review-container"></div>
            </BaseCard>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BookInfo from "@/components/features/common/BookInfo.vue";
import { useUserStore } from "@/stores/user";
import type { Book, Review } from "@/types";
import { useRoute } from "vue-router";
import { useBooksStore } from "@/stores/books";
import PageTitle from "@/components/ui/PageTitle.vue";

const book = ref<Book>({} as Book);
const { allUsers } = useUserStore();
const { pastBooks } = useBooksStore();

interface UserReview {
    reviewer: string;
    review: Review;
}

const route = useRoute();

const userReviews = ref<UserReview[]>([]);
const aggregateRating = ref("");

const emptyReview = {
    rating: 0,
    review: "this lazy fuck didn't say shit",
};

const loadBookData = () => {
    const bookId = route.params.bookId as string;
    book.value = pastBooks.find((book) => book.id === bookId) as Book;

    userReviews.value = allUsers.map((user) => ({
        reviewer: user.firstName,
        review: user.reviews[bookId] || emptyReview,
    }));

    const averageRating =
        userReviews.value.reduce(
            (acc, review) => acc + review.review.rating,
            0
        ) / userReviews.value.length;
    aggregateRating.value = averageRating.toFixed(1);
};

onMounted(() => {
    loadBookData();
});

watch(
    () => route.params.bookId,
    (newBookId, oldBookId) => {
        if (newBookId && newBookId !== oldBookId) {
            loadBookData();
        }
    }
);
</script>

<style scoped>
.book-detail-container {
    display: flex;
    padding-top: 2rem;
    width: 100%;
    justify-content: space-between;
    gap: 3rem;
}
hr {
    border: 1px solid var(--accent-blue);
}
.review-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (max-width: 768px) {
    .book-detail-container {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
