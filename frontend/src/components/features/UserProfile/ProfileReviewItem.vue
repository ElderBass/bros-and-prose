<template>
    <div class="profile-review-item" :style="{ '--theme-color': themeColor }">
        <div class="content">
            <div class="header-content">
                <span class="book-title">{{ bookTitle }}</span>
                <div class="meta">
                    <span class="book-author">by {{ bookAuthor }}</span>
                    <span class="dot">•</span>
                    <span class="timestamp">{{
                        formatDateForDevice(review.createdAt)
                    }}</span>
                </div>
            </div>
            <div class="rating-block">
                <BookRatingInput
                    :model-value="review.rating ?? 0"
                    :size="mobile ? 'xsmall' : 'medium'"
                    :read-only="true"
                />
            </div>
            <transition name="fade">
                <p v-if="showFullReview" class="review-text">
                    {{ review.reviewComment }}
                </p>
            </transition>
            <div class="toggle">
                <BaseButton
                    size="xsmall"
                    :variant="
                        showFullReview ? 'outline-secondary' : 'outline-success'
                    "
                    @click="showFullReview = !showFullReview"
                >
                    {{ showFullReview ? "hide review" : "peep review" }}
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";
import BookRatingInput from "@/components/form/BookRatingInput.vue";
import type { Review } from "@/types";

const props = withDefaults(
    defineProps<{
        review: Review;
        username?: string;
    }>(),
    {
        username: "mystery-bro",
    }
);

const { mobile } = useDisplay();

const showFullReview = ref(false);

const themeVariant = computed(() => {
    const rating = props.review.rating ?? 0;
    if (rating <= 4) return "red";
    if (rating <= 6) return "fuschia";
    if (rating <= 8) return "blue";
    return "green";
});

const themeColor = computed(() => {
    switch (themeVariant.value) {
        case "red":
            return "var(--accent-red)";
        case "fuschia":
            return "var(--accent-fuschia)";
        case "green":
            return "var(--accent-green)";
        case "blue":
        default:
            return "var(--accent-blue)";
    }
});

type ReviewBookMeta = Review["book"] & { title?: string; name?: string };

const bookTitle = computed(() => {
    const meta = props.review.book as ReviewBookMeta;
    return meta.title || meta.name || "unknown book";
});

const bookAuthor = computed(
    () => props.review.book.author || "anonymous wordsmith"
);

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
    gap: 0.9rem;
    padding: 0.75rem;
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
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.header-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.95rem;
    opacity: 0.85;
    color: var(--main-text);
    flex-wrap: wrap;
    padding-left: 0.5rem;
}

.book-title {
    font-weight: 600;
    font-style: italic;
    font-size: 1.25rem;
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

.username-line {
    margin: 0;
    font-size: 1rem;
    opacity: 0.85;
    color: var(--main-text);
}

.username {
    color: var(--accent-fuschia);
    font-weight: 600;
    margin-right: 0.25rem;
}

.timestamp {
    font-size: 0.9rem;
    opacity: 0.75;
}

.review-text {
    margin: 0;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--main-text);
    white-space: pre-line;
}

.toggle {
    display: flex;
    justify-content: flex-end;
}

.rating-block :deep(.book-rating-input) {
    width: 100%;
}

.rating-block :deep(.rating-message) {
    font-size: 1rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 768px) {
    .profile-review-item {
        font-size: 0.95rem;
        gap: 0.75rem;
    }

    .content {
        gap: 0.5rem;
    }

    .header-content {
        gap: 0.25rem;
    }

    .rating-value {
        font-size: 1.1rem;
    }
}
</style>
