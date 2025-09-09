<template>
    <form class="rate-and-review-book-form" @submit.prevent="onSubmit">
        <div class="heading">
            <p class="heading-text">leave a review for</p>
            <div class="book-info">
                <span class="book-title">{{ currentBook?.title }}</span>
                <p class="heading-text">by</p>
                <span class="book-author">{{ currentBook?.author }}</span>
            </div>
        </div>
        <div class="star-rating-container">
            <BookRatingInput v-model="starRating" size="medium" />
        </div>
        <div class="review-comment-input-container">
            <label for="review-comment-input"
                >got more to say? (optional)</label
            >
            <textarea
                rows="8"
                v-model="reviewComment"
                id="review-comment-input"
                class="review-comment-input"
                placeholder="remember that brevity is the soul of wit, you twat..."
                :disabled="false"
            />
        </div>
        <div class="form-actions">
            <BaseButton
                :size="buttonSize"
                @click="handleCancel"
                variant="outline-secondary"
                style="width: 100%"
                title="back out of this shitty review"
            >
                cancel
            </BaseButton>
            <BaseButton
                :size="buttonSize"
                type="submit"
                variant="primary"
                style="width: 100%"
                title="fucking send that shit, bro"
            >
                submit
            </BaseButton>
        </div>
    </form>
</template>

<script setup lang="ts">
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import { ref, computed } from "vue";
import type { SubmitReviewArgs, Book } from "@/types";

const props = defineProps<{
    currentBook: Book;
    handleCancel: () => void;
    handleSubmit: (review: SubmitReviewArgs) => Promise<void>;
}>();

const starRating = ref(5);
const reviewComment = ref("");

const onSubmit = async () =>
    await props.handleSubmit({
        rating: starRating.value,
        reviewComment: reviewComment.value,
    });

const buttonSize = computed(() => {
    return window.innerWidth < 768 ? "small" : "medium";
});
</script>

<style scoped>
.rate-and-review-book-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    height: 100%;
}

.heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding-top: 0.5rem;
}

.heading-text {
    font-size: 1.125rem;
    color: var(--main-text);
    text-align: center;
}

.book-info {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    gap: 0.5rem;
}

.book-title {
    font-size: 1.5rem;
    font-style: italic;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
}

.book-author {
    font-size: 1.25rem;
    color: var(--accent-lavender);
    font-family: "Libre Baskerville", serif;
}

.star-rating-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
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

.form-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

/* Responsive adjustments for small screens */
@media (max-width: 768px) {
    .book-info {
        flex-direction: column;
        gap: 0;
    }

    .book-title {
        font-size: 1.25rem;
    }

    .book-author {
        font-size: 1rem;
    }

    .heading {
        padding-top: 0.25rem;
        gap: 0;
    }

    .heading-text {
        font-size: 1rem;
    }

    label {
        font-size: 1.125rem;
    }

    .review-comment-input {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .book-title {
        font-size: 1.125rem;
    }

    .book-author {
        font-size: 0.875rem;
    }

    .book-info {
        flex-direction: column;
        gap: 0;
    }

    .heading-text {
        font-size: 0.875rem;
    }
}
</style>
