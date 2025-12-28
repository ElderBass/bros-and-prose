<template>
    <BaseModal
        :modelValue="open"
        @close="closeModal"
        @update:modelValue="(v: boolean) => !v && closeModal"
        title="the past in present tense"
        size="medium"
        shadow-color="green"
        :header-icon="faBookOpen"
    >
        <div v-if="book" class="content">
            <div class="top">
                <BookCover :book="book" />

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
                                startEditDetails(book as BookshelfBook)
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

                    <TagsSection :book="book" />
                </div>
            </div>

            <BlurbSection :book="book" :canReview="canReview" />

            <ReviewSection
                :book="book"
                :review="review"
                :canReview="canReview"
                @editReview="startEditReview(book as BookshelfBook)"
                @review="startReview(book as BookshelfBook)"
            />
        </div>
        <div v-else class="content">
            <p class="empty italics">no book selected.</p>
        </div>

        <template #footer>
            <ActionButtons
                :book="book"
                :isLoggedInUser="canReview"
                @recommend="startRecommend(book as BookshelfBook)"
                @close="closeModal"
            />
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook, Review } from "@/types";
import BookCover from "./BookDetailsComponents/BookCover.vue";
import BlurbSection from "./BookDetailsComponents/BlurbSection.vue";
import ReviewSection from "./BookDetailsComponents/ReviewSection.vue";
import TagsSection from "./BookDetailsComponents/TagsSection.vue";
import ActionButtons from "./BookDetailsComponents/ActionButtons.vue";
import { faBookOpen, faMarker } from "@fortawesome/free-solid-svg-icons";
import { useShelfModalStore } from "@/stores/shelfModal";
import { recommendBook } from "@/utils";

defineProps<{
    open: boolean;
    book: BookshelfBook;
    review: Review | null;
    canReview: boolean;
}>();

const { mobile } = useDisplay();
const { openReviewForBook, openEditBook, closeModal } = useShelfModalStore();

const editButtonSize = computed(() => (mobile.value ? "xsmall" : "small"));

const startReview = (book: BookshelfBook) => {
    openReviewForBook(book, "haveRead");
};

const startEditDetails = (book: BookshelfBook) => {
    openEditBook(book, "haveRead");
};

const startEditReview = (book: BookshelfBook) => {
    openReviewForBook(book, "haveRead");
};

const startRecommend = (book: BookshelfBook) => {
    recommendBook(book);
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

.empty {
    margin: 0;
    opacity: 0.75;
    color: var(--main-text);
}

.italics {
    font-style: italic;
}

@media (max-width: 768px) {
    .top {
        gap: 0.75rem;
    }
    .title {
        font-size: 1.35rem;
    }
}
</style>
