<template>
    <form
        class="rate-and-review-book-form"
        @submit.prevent="$emit('submit', $event)"
    >
        <div class="heading">
            <p class="heading-text">leave a review for</p>
            <div class="book-info">
                <span class="book-title">{{ book?.title }}</span>
                <p class="heading-text">by</p>
                <span class="book-author">{{ book?.author }}</span>
            </div>
        </div>
        <ReviewFormInputs
            :rating="rating"
            :comment="comment"
            @update="emit('update', $event)"
        />
        <div class="form-actions">
            <BaseButton
                @click="$emit('cancel', $event)"
                variant="outline-secondary"
                title="back out of this shitty review"
                v-bind="buttonProps"
            >
                cancel
            </BaseButton>
            <BaseButton
                type="submit"
                variant="primary"
                title="fucking send that shit, bro"
                v-bind="buttonProps"
            >
                submit
            </BaseButton>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import ReviewFormInputs from "@/components/form/ReviewFormInputs.vue";
import type { Book, BookshelfBook, SubmitReviewArgs } from "@/types";

const { mobile } = useDisplay();

defineProps<{
    book: Book | BookshelfBook;
    rating: number;
    comment: string;
}>();

const emit = defineEmits<{
    (e: "update", value: SubmitReviewArgs): void;
    (e: "submit", value: Event): void;
    (e: "cancel", value: Event): void;
}>();

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: { width: "100%" },
    };
});
</script>

<style scoped>
.rate-and-review-book-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
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
