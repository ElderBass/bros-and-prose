<template>
    <div class="profile-review-item" :style="{ '--theme-color': themeColor }">
        <div class="content">
            <header class="review-header">
                <div class="title-block">
                    <span class="eyebrow">book review</span>
                    <h4 class="book-title">{{ bookTitle }}</h4>
                </div>
                <div class="meta">
                    <span class="book-author">by {{ bookAuthor }}</span>
                    <span class="dot">•</span>
                    <span class="timestamp">{{
                        formatDateForDevice(review.createdAt)
                    }}</span>
                </div>
            </header>

            <div class="rating-block">
                <BookRatingInput
                    :model-value="review.rating ?? 0"
                    :size="mobile ? 'xsmall' : 'medium'"
                    :read-only="true"
                />
            </div>

            <div class="review-copy">
                <ExpandableText
                    :text="reviewText"
                    :truncateLength="truncateLength"
                    :hideMoreButton="!hasReviewComment"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import ExpandableText from "@/components/features/common/ExpandableText.vue";
import type { Review } from "@/types";
import { getReviewThemeColor } from "@/utils";

const props = defineProps<{
    review: Review;
}>();

const { mobile } = useDisplay();

const themeColor = computed(() =>
    getReviewThemeColor(props.review.rating ?? 0)
);

type ReviewBookMeta = Review["book"] & { title?: string; name?: string };

const bookTitle = computed(() => {
    const meta = props.review.book as ReviewBookMeta;
    return meta.title || meta.name || "unknown book";
});

const bookAuthor = computed(
    () => props.review.book.author || "anonymous wordsmith"
);

const hasReviewComment = computed(
    () => props.review.reviewComment.trim().length > 0
);

const reviewText = computed(() =>
    hasReviewComment.value
        ? props.review.reviewComment
        : "no written take, just vibes and a number."
);

const truncateLength = computed(() => (mobile.value ? 160 : 220));

const formatDateForDevice = computed(() => {
    return (iso: string) => {
        try {
            const d = new Date(iso);
            return mobile.value === true
                ? d.toLocaleString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                  })
                : d.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                  });
        } catch {
            return iso;
        }
    };
});
</script>

<style scoped>
.profile-review-item {
    display: flex;
    min-width: 0;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--theme-color);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--theme-color) 12%, transparent),
        color-mix(in srgb, var(--theme-color) 5%, transparent)
    );
    box-shadow:
        0 4px 20px color-mix(in srgb, var(--theme-color) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    z-index: 10;
    min-height: 100%;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    min-width: 0;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
}

.title-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.eyebrow {
    color: var(--theme-color);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.85;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.95rem;
    opacity: 0.85;
    color: var(--main-text);
    justify-content: flex-end;
    flex-wrap: wrap;
    text-align: right;
}

.book-title {
    margin: 0;
    font-weight: 600;
    font-style: italic;
    font-size: 1.35rem;
    line-height: 1.2;
    letter-spacing: 0.04em;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
}

.book-author {
    color: var(--accent-blue);
}

.dot {
    opacity: 0.5;
}

.rating-block {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.timestamp {
    font-size: 0.9rem;
    opacity: 0.75;
}

.review-copy {
    flex: 1;
    min-width: 0;
}

.review-copy :deep(.text) {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 5%, transparent);
    font-size: 1rem;
}

.rating-block :deep(.book-rating-input) {
    width: 100%;
}

.rating-block :deep(.rating-message) {
    font-size: 1rem;
}

@media (max-width: 768px) {
    .profile-review-item {
        font-size: 0.95rem;
        gap: 0.75rem;
        padding: 0.75rem;
    }

    .content {
        gap: 0.5rem;
    }

    .review-header {
        flex-direction: column;
        gap: 0.4rem;
    }

    .meta {
        justify-content: flex-start;
        text-align: left;
    }

    .book-title {
        font-size: 1.1rem;
    }

    .review-copy :deep(.text) {
        font-size: 0.95rem;
    }
}
</style>
