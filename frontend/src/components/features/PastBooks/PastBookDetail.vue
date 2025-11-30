<template>
    <div class="book-detail-container">
        <BaseCard shadowColor="blue" size="medium">
            <BookInfo :book="book" />
        </BaseCard>
        <BroReviewsSection :book="book" :broReviews="userReviews" />
    </div>
    <GroupConsensus
        :groupConsensus="book.groupConsensus"
        :averageRating="aggregateRating"
    />
    <InbrospectionSection :book="book" />
</template>

<script setup lang="ts">
import BookInfo from "@/components/features/common/BookInfo.vue";
import BroReviewsSection from "@/components/features/PastBooks/BroReviewsSection.vue";
import GroupConsensus from "@/components/features/PastBooks/GroupConsensusSection.vue";
import InbrospectionSection from "@/components/features/PastBooks/InbrospectionSection.vue";
import type { Book, BroReview } from "@/types";

defineProps<{
    book: Book;
    userReviews: BroReview[];
    aggregateRating: string;
}>();
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

.review-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (max-width: 768px) {
    .book-detail-container {
        flex-direction: column;
        gap: 2rem;
    }
}
</style>
