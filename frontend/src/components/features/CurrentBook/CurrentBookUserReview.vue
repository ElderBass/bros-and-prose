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
        <div class="review-comment-section" v-if="comment">
            <p class="review-comment-text">what you said</p>
            <div class="comment-container">
                <Transition name="comment-expand" mode="out-in">
                    <p
                        :key="showFullComment ? 'expanded' : 'collapsed'"
                        class="comment-text"
                        :class="{ expanded: showFullComment }"
                    >
                        {{ displayComment }}
                    </p>
                </Transition>
                <div v-if="isLongComment" class="show-more-btn-container">
                    <button class="show-more-btn" @click="toggleComment">
                        {{ showFullComment ? "show less" : "show more" }}
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="no-comment-section">
            <p class="no-comment-text">you ain't said shit, boi</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";

const props = defineProps<{
    rating: number;
    comment: string;
    showReviewModal: () => void;
}>();

const showFullComment = ref(false);
const currentRating = ref(props.rating);

const COMMENT_TRUNCATE_LENGTH = 300;

const isLongComment = computed(() => {
    return props.comment.length > COMMENT_TRUNCATE_LENGTH;
});

const displayComment = computed(() => {
    if (!isLongComment.value || showFullComment.value) {
        return props.comment;
    }
    return props.comment.substring(0, COMMENT_TRUNCATE_LENGTH) + "...";
});

const toggleComment = () => {
    showFullComment.value = !showFullComment.value;
};
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

.review-comment-text {
    flex: 0;
    font-size: 1.25rem;
    padding-left: 0.5rem;
    color: var(--accent-lavender);
}

.review-comment-section {
    display: flex;
    flex-direction: column;
}

.comment-container {
    background: var(--surface-color);
    padding-bottom: 0;
    position: relative;
}

.comment-text {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--main-text);
    margin: 0;
    padding: 0.5rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-left: 1px solid var(--accent-blue);
    border-top: 1px solid var(--accent-blue);
    border-top-left-radius: 0.5rem;
}

.comment-text:not(.expanded) {
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Vue Transition Classes for Comment Expansion */
.comment-expand-enter-active,
.comment-expand-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.comment-expand-enter-from {
    opacity: 0;
    transform: translateY(10px);
    max-height: 0;
}

.comment-expand-enter-to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px; /* Large enough for expanded content */
}

.comment-expand-leave-from {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
}

.comment-expand-leave-to {
    opacity: 0;
    transform: translateY(10px);
    max-height: 0;
}

.show-more-btn-container {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.25rem;
    padding-right: 0.5rem;
}

.show-more-btn {
    background: none;
    border: none;
    color: var(--accent-fuschia);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s ease;
}

.show-more-btn:hover {
    color: var(--accent-lavender);
}

.no-comment-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: var(--surface-color);
    border: 1px dashed var(--slate-gray);
    border-radius: 0.5rem;
}

.no-comment-text {
    font-style: italic;
    color: var(--slate-gray);
    font-size: 1rem;
    margin: 0;
}

.review-actions {
    display: flex;
    justify-content: center;
    width: 100%;
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

    .review-comment-text {
        font-size: 1.125rem;
    }
    .comment-text {
        font-size: 1rem;
    }
    .show-more-btn {
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

    .review-comment-text {
        font-size: 1rem;
    }

    .comment-text {
        font-size: 0.875rem;
    }
    .show-more-btn {
        font-size: 0.875rem;
    }
}
</style>
