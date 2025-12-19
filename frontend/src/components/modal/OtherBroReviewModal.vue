<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="bro's got thoughts"
        size="medium"
        shadowColor="green"
    >
        <div class="other-bro-review">
            <div class="heading">
                <p class="heading-text">
                    peeping
                    <UsernameLink :username="brosName" fontSize="large" />
                    >'s review for
                </p>
                <div class="book-info">
                    <span class="book-title">{{
                        props.brosReview.book?.title
                    }}</span>
                    <p class="heading-text">by</p>
                    <span class="book-author">{{
                        props.brosReview.book?.author
                    }}</span>
                </div>
            </div>
            <div class="star-rating-container">
                <BookRatingInput
                    v-model="broReview.rating"
                    size="medium"
                    :readOnly="true"
                />
            </div>
            <ReviewComment
                :comment="broReview.reviewComment"
                :isFromCurrentUser="false"
            />
            <div class="form-actions">
                <BaseButton
                    :size="buttonSize"
                    @click="onClose"
                    variant="outline-secondary"
                    style="width: 100%"
                    title="back out of this shitty review"
                >
                    close
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { Review } from "@/types";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import ReviewComment from "../features/Review/ReviewComment.vue";

const { mobile } = useDisplay();

const props = defineProps<{
    open: boolean;
    brosName: string;
    brosReview: Review;
    onClose: () => void;
}>();

const broReview = computed(() => {
    return {
        rating: props.brosReview.rating || 0,
        reviewComment: props.brosReview.reviewComment || "",
    };
});

const buttonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});
</script>

<style scoped>
.other-bro-review {
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
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
}

.star-rating-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.form-actions {
    display: flex;
    align-items: center;
    justify-content: center;
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
}

@media (max-width: 480px) {
    .book-title {
        font-size: 1.125rem;
    }

    .book-author {
        font-size: 0.875rem;
    }

    .other-bro-name {
        font-size: 1rem;
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
