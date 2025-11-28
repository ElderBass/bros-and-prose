<template>
    <div class="list-item-details">
        <BookRecommendationDetails
            v-if="entry.recommendation"
            :recommendation="entry.recommendation"
        />
        <p class="text">{{ entry.text }}</p>
        <ReactionDetails
            :likes="entry.likes || []"
            :dislikes="entry.dislikes || []"
        />
        <CommentsSection
            :entry="entry"
            :variant="variant"
            commentSize="compact"
        />
    </div>
</template>

<script setup lang="ts">
import type { PalaverEntry } from "@/types";
import BookRecommendationDetails from "@/components/features/Palaver/PalaverListItem/BookRecommendationDetails.vue";
import ReactionDetails from "@/components/features/Palaver/PalaverListItem/ReactionDetails.vue";
import CommentsSection from "@/components/features/Palaver/PalaverListItem/CommentsSection.vue";

withDefaults(
    defineProps<{
        entry: PalaverEntry;
        variant?: "lavender" | "fuschia" | "blue" | "green" | "red";
    }>(),
    {
        variant: "lavender",
    }
);
</script>

<style scoped>
.list-item-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}
.text {
    font-size: 1.125rem;
    margin: 0;
    line-height: 1.6;
    padding: 0.5rem;
    padding-left: 0.75rem;
    margin-right: 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-left: 1px solid var(--accent-blue);
    border-top: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
}

@media (max-width: 768px) {
    .list-item-details {
        gap: 0.25rem;
        padding: 0;
    }

    .text {
        font-size: 1rem;
        padding: 0.2x5rem;
        padding-left: 0.5rem;
    }
}
</style>
