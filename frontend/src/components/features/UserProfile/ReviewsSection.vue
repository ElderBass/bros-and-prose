<template>
    <section v-if="reviews" class="reviews-section">
        <PageTitle title="reviews" />
        <div v-if="!reviews.length" class="empty-state">
            <p>zero takes logged. start beefing with some books.</p>
        </div>
        <div v-else class="reviews-list">
            <ProfileReviewItem
                v-for="review in reviews"
                :key="review.id"
                :review="review"
                :username="username"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import PageTitle from "@/components/ui/PageTitle.vue";
import ProfileReviewItem from "./ProfileReviewItem.vue";
import type { Review } from "@/types";

withDefaults(
    defineProps<{
        username: string;
        reviews: Review[];
        heading?: string;
    }>(),
    {
        heading: "shit you've said about books",
    }
);
</script>

<style scoped>
.reviews-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    margin-top: 2rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.02)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    width: 100%;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.empty-state {
    padding: 1.5rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    text-align: center;
    font-style: italic;
    opacity: 0.85;
}

@media (max-width: 768px) {
    h3 {
        font-size: 1.1rem;
    }
}
</style>
