<template>
    <div class="section review-section">
        <div class="section-title-row">
            <h3 class="section-title">{{ possessiveLabel }} review</h3>
            <IconButton
                v-if="canReview && review"
                :icon="faMarker"
                :size="buttonSize"
                color="green"
                shadowColor="green"
                title="edit review"
                :handleClick="() => emit('editReview', book as BookshelfBook)"
            />
        </div>
        <div v-if="review" class="review">
            <div class="review-top">
                <span class="rating">{{ review.rating }}/10</span>
                <span class="review-date">{{
                    formatDate(review.createdAt)
                }}</span>
            </div>
            <ExpandableText
                :text="review.reviewComment"
                :truncateLength="100"
                :isLoggedInUser="canReview"
            />
        </div>
        <div v-else class="empty-row">
            <p class="empty italics">unreviewed - no thoughts, no vibes.</p>
            <BaseButton
                v-if="canReview"
                variant="success"
                title="leave a review"
                @click="emit('review', book)"
            >
                leave a review
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook, Review } from "@/types";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import ExpandableText from "@/components/features/common/ExpandableText.vue";

const { mobile } = useDisplay();

const props = defineProps<{
    book: BookshelfBook;
    review: Review | null;
    canReview: boolean;
}>();

const emit = defineEmits<{
    (e: "editReview", book: BookshelfBook): void;
    (e: "review", book: BookshelfBook): void;
}>();

const buttonSize = computed(() => (mobile.value ? "xsmall" : "small"));
const possessiveLabel = computed(() => (props.canReview ? "your" : "bro's"));

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString();
    } catch {
        return "";
    }
};
</script>

<style scoped>
.section {
    padding-top: 0.75rem;
}

.section-title {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--main-text);
    opacity: 0.9;
    text-transform: lowercase;
}

.section-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.section-title-row .section-title {
    margin: 0;
}

.review {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.review-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
}

.rating {
    font-weight: 700;
    color: var(--accent-green);
}

.review-date {
    font-size: 0.85rem;
    opacity: 0.7;
    font-style: italic;
}

.empty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}

.empty {
    margin: 0;
    opacity: 0.75;
    color: var(--main-text);
}

.italics {
    font-style: italic;
}
</style>
