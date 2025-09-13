<template>
    <div class="current-book-user-review">
        <div class="review-rating-section">
            <div class="rating-display">
                <BookRatingInput
                    v-model="currentRating"
                    size="medium"
                    :disabled="true"
                    :readOnly="true"
                />
            </div>
        </div>
        <ReviewComment :comment="comment" :isFromCurrentUser="true" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import ReviewComment from "../Review/ReviewComment.vue";

const props = defineProps<{
    rating: number;
    comment: string;
    showReviewModal: () => void;
}>();

const currentRating = ref(props.rating);
</script>

<style scoped>
.current-book-user-review {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
    padding: 1rem;
    padding-top: 0.25rem;
}

.review-rating-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.rating-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.book-icons {
    display: flex;
    gap: 0.25rem;
    font-size: 1.25rem;
}

.book-filled {
    color: var(--accent-lavender);
}

.book-empty {
    color: var(--slate-gray);
    opacity: 0.3;
}

.rating-text {
    font-size: 1.125rem;
    color: var(--accent-blue);
    font-weight: 600;
}

@media (max-width: 768px) {
    .current-book-user-review {
        padding: 0.75rem;
        gap: 0.75rem;
    }

    .book-icons {
        font-size: 1rem;
        gap: 0.125rem;
    }

    .rating-text {
        font-size: 0.875rem;
    }
}

@media (max-width: 480px) {
    .current-book-user-review {
        padding: 0;
    }

    .book-icons {
        gap: 0.1rem;
    }
}
</style>
