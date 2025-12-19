<template>
    <BaseModal
        :modelValue="open"
        @close="emit('close')"
        @update:modelValue="(v: boolean) => !v && emit('close')"
        title="the past in present tense"
        size="medium"
        shadow-color="green"
        :header-icon="faBookOpen"
    >
        <div v-if="book" class="content">
            <div class="top">
                <div class="cover-wrap">
                    <img
                        v-if="book.imageSrc"
                        class="cover"
                        :src="book.imageSrc"
                        :alt="book.title"
                    />
                    <div v-else class="cover-placeholder">
                        <FontAwesomeIcon :icon="faBook" />
                    </div>
                </div>

                <div class="headline">
                    <div class="title-row">
                        <h2 class="title">{{ book.title }}</h2>
                        <IconButton
                            v-if="canReview"
                            :icon="faMarker"
                            :size="editButtonSize"
                            color="green"
                            shadowColor="green"
                            title="edit details (tags + blurb)"
                            :handleClick="
                                () => emit('editDetails', book as BookshelfBook)
                            "
                        />
                    </div>
                    <p class="author">{{ book.author }}</p>

                    <div class="meta">
                        <span class="meta-item">
                            <span class="meta-label">year</span>
                            <span class="meta-value">{{
                                book.yearPublished || "—"
                            }}</span>
                        </span>
                        <span class="meta-sep">|</span>
                        <span class="meta-item">
                            <span class="meta-label">pages</span>
                            <span class="meta-value">{{
                                book.pages || "—"
                            }}</span>
                        </span>
                    </div>

                    <div v-if="book.tags?.length" class="tags">
                        <BookTag
                            v-for="tag in book.tags"
                            :key="tag"
                            :tag="tag"
                            :selected="true"
                            color="green"
                            size="small"
                        />
                    </div>
                    <p v-else class="empty-tags">no tags like Hanes briefs.</p>
                </div>
            </div>

            <div class="section">
                <h3 class="section-title">{{ possessiveLabel }} blurb</h3>
                <p v-if="book.description" class="description">
                    {{ book.description }}
                </p>
                <p v-else class="empty italics">
                    {{ canReview ? "you" : "homeboy" }} ain't said shit.
                </p>
            </div>

            <div class="section review-section">
                <div class="section-title-row">
                    <h3 class="section-title">{{ possessiveLabel }} review</h3>
                    <IconButton
                        v-if="canReview && review"
                        :icon="faMarker"
                        :size="editButtonSize"
                        color="green"
                        shadowColor="green"
                        title="edit review"
                        :handleClick="
                            () => emit('editReview', book as BookshelfBook)
                        "
                    />
                </div>
                <div v-if="review" class="review">
                    <div class="review-top">
                        <span class="rating">{{ review.rating }}/10</span>
                        <span class="review-date">{{
                            formatDate(review.createdAt)
                        }}</span>
                    </div>
                    <p class="review-comment">{{ review.reviewComment }}</p>
                </div>
                <div v-else class="empty-row">
                    <p class="empty italics">
                        unreviewed - no thoughts, no vibes.
                    </p>
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
        </div>
        <div v-else class="content">
            <p class="empty italics">no book selected.</p>
        </div>

        <template #footer>
            <BaseButton
                variant="outline-secondary"
                title="close"
                @click="emit('close')"
            >
                close
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook, Review } from "@/types";
import BookTag from "@/components/ui/BookTag.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faBook,
    faBookOpen,
    faMarker,
} from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";

const props = defineProps<{
    open: boolean;
    book: BookshelfBook | null;
    review: Review | null;
    canReview: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
    (e: "review", book: BookshelfBook): void;
    (e: "editDetails", book: BookshelfBook): void;
    (e: "editReview", book: BookshelfBook): void;
}>();

const possessiveLabel = computed(() => (props.canReview ? "your" : "bro's"));

const { mobile } = useDisplay();
const editButtonSize = computed(() => (mobile.value ? "xsmall" : "small"));

const formatDate = (iso: string) => {
    try {
        return new Date(iso).toLocaleDateString();
    } catch {
        return "";
    }
};
</script>

<style scoped>
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-top: 0.5rem;
}

.top {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.cover-wrap {
    flex: 0 0 auto;
}

.cover {
    width: 110px;
    height: 160px;
    object-fit: cover;
    border-radius: 0.75rem;
    border: 1px solid var(--accent-green);
}

.cover-placeholder {
    width: 110px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 2px dashed var(--accent-green);
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-green) 12%, transparent),
        color-mix(in srgb, var(--accent-green) 6%, transparent)
    );
    color: var(--accent-green);
    font-size: 2rem;
}

.headline {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
}

.title {
    margin: 0;
    font-size: 1.6rem;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    line-height: 1.15;
}

.author {
    margin: 0;
    color: var(--accent-green);
    font-size: 1rem;
    opacity: 0.95;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: var(--main-text);
    opacity: 0.9;
    flex-wrap: wrap;
}

.meta-item {
    display: inline-flex;
    gap: 0.35rem;
    align-items: baseline;
}

.meta-label {
    color: var(--accent-green);
    font-weight: 600;
    opacity: 0.9;
}

.meta-sep {
    opacity: 0.5;
    color: var(--accent-green);
}

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

.tags {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.description,
.review-comment {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--main-text);
    opacity: 0.92;
    border-top: 1px solid var(--accent-green);
    border-left: 1px solid var(--accent-green);
    border-top-left-radius: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0.25rem;
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

.empty-tags {
    border: 1px dashed var(--accent-green);
    border-radius: 1rem;
    padding: 0.5rem;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--main-text);
    opacity: 0.75;
    text-align: center;
    margin-top: 0.5rem;
}

.italics {
    font-style: italic;
}

@media (max-width: 768px) {
    .top {
        gap: 0.75rem;
    }
    .cover,
    .cover-placeholder {
        width: 84px;
        height: 122px;
    }
    .title {
        font-size: 1.35rem;
    }
}
</style>
