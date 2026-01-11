<template>
    <div class="rating-and-favorite-container">
        <div class="star-rating-container">
            <BookRatingInput v-model="starRating" size="medium" />
        </div>
        <FavoriteToggle
            v-if="showFavoriteToggle"
            :isFavorited="isFavorited"
            @toggle="emit('update:isFavorited')"
        />
    </div>
    <div class="review-comment-input-container">
        <label for="review-comment-input"> got more to say? (optional) </label>
        <textarea
            rows="8"
            v-model="reviewComment"
            id="review-comment-input"
            class="review-comment-input"
            placeholder="remember that brevity is the soul of wit, you twat..."
            :disabled="false"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import FavoriteToggle from "@/components/form/BookForm/FavoriteToggle.vue";
import type { SubmitReviewArgs } from "@/types";

const props = withDefaults(
    defineProps<{
        rating: number;
        comment: string;
        isFavorited?: boolean;
        showFavoriteToggle?: boolean;
    }>(),
    {
        isFavorited: false,
        showFavoriteToggle: false,
    }
);

const emit = defineEmits<{
    (e: "update", value: SubmitReviewArgs): void;
    (e: "update:isFavorited"): void;
}>();

const starRating = ref(props.rating);
const reviewComment = ref(props.comment);

watch(starRating, () => {
    emit("update", {
        rating: starRating.value,
        reviewComment: reviewComment.value,
    });
});

watch(reviewComment, () => {
    emit("update", {
        rating: starRating.value,
        reviewComment: reviewComment.value,
    });
});
</script>

<style scoped>
.rating-and-favorite-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
}

.star-rating-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.review-comment-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.review-comment-input {
    width: 100%;
    height: 100%;
    resize: none;
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    color: var(--main-text);
    background-color: var(--background-color);
}

label {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-lavender);
    margin-left: 0.5rem;
}

@media (max-width: 768px) {
    .rating-and-favorite-container {
        flex-direction: column;
        gap: 0.75rem;
    }

    .review-comment-input {
        font-size: 1rem;
    }

    label {
        font-size: 1rem;
    }
}
</style>
