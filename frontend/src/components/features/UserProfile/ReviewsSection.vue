<template>
    <section v-if="reviews" class="reviews-section">
        <ExpansionPanel>
            <template #title>
                <PageTitle title="reviews" :style="'margin: 0.5rem'" />
            </template>
            <template #text>
                <div v-if="!reviews.length" class="empty-state">
                    <p>zero takes logged. start beefing with some books.</p>
                </div>
                <InfiniteScroll
                    v-else
                    class="reviews-list"
                    direction="horizontal"
                >
                    <ProfileReviewItem
                        v-for="review in reviews"
                        :key="review.id"
                        :review="review"
                        :username="username"
                    />
                </InfiniteScroll>
            </template>
        </ExpansionPanel>
    </section>
</template>

<script setup lang="ts">
import ExpansionPanel from "@/components/ui/ExpansionPanel.vue";
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
    width: 100%;
    margin-top: 2rem;
}

.reviews-list {
    display: flex;
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
