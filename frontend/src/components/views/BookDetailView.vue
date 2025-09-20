<template>
    <AppLayout>
        <PageTitle title="take a closer look" />
        <div class="book-detail-container">
            <BaseCard shadowColor="blue" size="medium">
                <BookInfo :book="book" />
            </BaseCard>
            <BroReviewsCard :book="book" :broReviews="userReviews" />
        </div>
        <div class="group-consensus-container">
            <GroupConsensus
                v-if="book.groupConsensus"
                :groupConsensus="book.groupConsensus"
                :averageRating="aggregateRating"
            />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AppLayout from "../layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import BookInfo from "@/components/features/common/BookInfo.vue";
import BroReviewsCard from "@/components/features/PastBooks/BroReviewsCard.vue";
import GroupConsensus from "@/components/features/PastBooks/GroupConsensus.vue";

import type { Book, BroReview } from "@/types";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
import { useBooksStore } from "@/stores/books";

const book = ref<Book>({} as Book);
const { allUsers } = useUserStore();
const { pastBooks } = useBooksStore();

const route = useRoute();

const userReviews = ref<BroReview[]>([]);
const aggregateRating = ref("");

const emptyReview = {
    rating: 0,
    review: "this lazy fuck didn't say shit",
};

const loadBookData = () => {
    const bookId = route.params.bookId as string;
    book.value = pastBooks.find((book) => book.id === bookId) as Book;
    userReviews.value = allUsers.map((user) => ({
        reviewer: user,
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
    align-items: center;
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
.group-consensus-container {
    margin-top: 2rem;
}

@media (max-width: 768px) {
    .book-detail-container {
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
