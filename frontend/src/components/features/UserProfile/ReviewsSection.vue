<template>
    <UserContentPanel
        title="reviews"
        noContentMessage="zero takes logged. start beefing with some books."
        :contentCount="reviews.length"
        color="lavender"
    >
        <template #content>
            <div class="reviews-feed">
                <div class="review-controls">
                    <div class="search-row">
                        <input
                            v-model="query"
                            class="search-input"
                            type="search"
                            placeholder="hunt by book, author, or hot take"
                            aria-label="search reviews"
                        />
                        <button
                            v-if="hasQuery"
                            type="button"
                            class="clear-search"
                            @click="query = ''"
                        >
                            clear
                        </button>
                        <span v-else class="result-count">
                            {{ visibleReviews.length }}/{{ reviews.length }}
                        </span>
                    </div>

                    <div class="filter-row">
                        <div class="rating-filters" aria-label="rating filters">
                            <button
                                v-for="filter in ratingFilters"
                                :key="filter.value"
                                type="button"
                                class="filter-chip"
                                :class="{
                                    active: ratingFilter === filter.value,
                                }"
                                @click="ratingFilter = filter.value"
                            >
                                {{ filter.label }}
                            </button>
                        </div>

                        <label class="sort-control">
                            <span>sort</span>
                            <select v-model="sortKey" class="sort-select">
                                <option
                                    v-for="option in sortOptions"
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.label }}
                                </option>
                            </select>
                        </label>
                    </div>
                </div>

                <div v-if="visibleReviews.length === 0" class="no-matches">
                    <p>no matching takes, my dude.</p>
                    <button
                        type="button"
                        class="reset-button"
                        @click="resetFilters"
                    >
                        clear the smoke
                    </button>
                </div>

                <TransitionGroup
                    v-else
                    name="review-list"
                    tag="div"
                    class="reviews-list"
                >
                    <div
                        v-for="review in visibleReviews"
                        :key="review.id"
                        class="review-list-item"
                    >
                        <ProfileReviewItem :review="review" />
                    </div>
                </TransitionGroup>
            </div>
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ProfileReviewItem from "./ProfileReviewItem.vue";
import type { Review } from "@/types";
import UserContentPanel from "./UserContentPanel.vue";

type RatingFilter = "all" | "loved" | "solid" | "rough" | "unrated";
type ReviewSortKey =
    | "newest"
    | "oldest"
    | "rating-high"
    | "rating-low"
    | "title";

type ReviewBookMeta = Review["book"] & { title?: string; name?: string };

const props = defineProps<{
    username: string;
    reviews: Review[];
    isLoggedInUser?: boolean;
}>();

const query = ref("");
const ratingFilter = ref<RatingFilter>("all");
const sortKey = ref<ReviewSortKey>("newest");

const ratingFilters: Array<{ label: string; value: RatingFilter }> = [
    { label: "all", value: "all" },
    { label: "loved", value: "loved" },
    { label: "solid", value: "solid" },
    { label: "rough", value: "rough" },
    { label: "unrated", value: "unrated" },
];

const sortOptions: Array<{ label: string; value: ReviewSortKey }> = [
    { label: "newest", value: "newest" },
    { label: "oldest", value: "oldest" },
    { label: "highest rated", value: "rating-high" },
    { label: "lowest rated", value: "rating-low" },
    { label: "title a-z", value: "title" },
];

const hasQuery = computed(() => query.value.trim().length > 0);

const getBookTitle = (review: Review) => {
    const book = review.book as ReviewBookMeta;
    return book.title || book.name || "";
};

const matchesRatingFilter = (review: Review) => {
    const rating = review.rating ?? 0;
    switch (ratingFilter.value) {
        case "loved":
            return rating >= 8;
        case "solid":
            return rating >= 5 && rating <= 7;
        case "rough":
            return rating >= 1 && rating <= 4;
        case "unrated":
            return rating <= 0;
        case "all":
        default:
            return true;
    }
};

const visibleReviews = computed(() => {
    const search = query.value.trim().toLowerCase();

    const filtered = props.reviews.filter((review) => {
        if (!matchesRatingFilter(review)) return false;
        if (!search) return true;

        return [
            getBookTitle(review),
            review.book.author,
            review.reviewComment,
        ].some((value) => (value || "").toLowerCase().includes(search));
    });

    return [...filtered].sort((a, b) => {
        switch (sortKey.value) {
            case "oldest":
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
            case "rating-high":
                return (b.rating ?? 0) - (a.rating ?? 0);
            case "rating-low":
                return (a.rating ?? 0) - (b.rating ?? 0);
            case "title":
                return getBookTitle(a).localeCompare(
                    getBookTitle(b),
                    undefined,
                    {
                        sensitivity: "base",
                    }
                );
            case "newest":
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
        }
    });
});

const resetFilters = () => {
    query.value = "";
    ratingFilter.value = "all";
    sortKey.value = "newest";
};
</script>

<style scoped>
.reviews-feed {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
}

.review-controls {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 45%, transparent);
    border-radius: 0.85rem;
    background: color-mix(
        in srgb,
        var(--surface-color) 92%,
        var(--accent-lavender)
    );
}

.search-row,
.filter-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
}

.search-input {
    flex: 1;
    min-width: 0;
    background: transparent;
    border: none;
    border-bottom: 2px solid
        color-mix(in srgb, var(--accent-lavender) 70%, transparent);
    color: var(--main-text);
    font-family: "Crimson Text", serif;
    font-size: 1rem;
    padding: 0.4rem 0.1rem;
    outline: none;
}

.search-input::placeholder {
    color: var(--main-text);
    opacity: 0.55;
    font-style: italic;
}

.search-input:focus {
    border-bottom-color: var(--accent-fuschia);
}

.clear-search,
.reset-button,
.filter-chip,
.sort-select {
    font-family: "Crimson Text", serif;
}

.clear-search,
.reset-button,
.filter-chip {
    cursor: pointer;
    border-radius: 999px;
    transition:
        border-color 0.2s ease,
        color 0.2s ease,
        background-color 0.2s ease;
}

.clear-search,
.reset-button {
    border: 1px solid var(--accent-fuschia);
    background: transparent;
    color: var(--accent-fuschia);
    padding: 0.25rem 0.65rem;
    font-weight: 600;
}

.result-count {
    color: var(--accent-lavender);
    font-size: 0.9rem;
    white-space: nowrap;
}

.filter-row {
    justify-content: space-between;
}

.rating-filters {
    display: flex;
    gap: 0.4rem;
    overflow-x: auto;
    scrollbar-width: thin;
    padding-bottom: 0.15rem;
}

.filter-chip {
    flex: 0 0 auto;
    border: 1px solid color-mix(in srgb, var(--accent-blue) 55%, transparent);
    background: transparent;
    color: var(--accent-blue);
    padding: 0.25rem 0.6rem;
    font-size: 0.9rem;
}

.filter-chip.active {
    border-color: var(--accent-lavender);
    background: color-mix(in srgb, var(--accent-lavender) 18%, transparent);
    color: var(--accent-lavender);
}

.sort-control {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--accent-lavender);
    font-size: 0.9rem;
    white-space: nowrap;
}

.sort-select {
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 65%, transparent);
    border-radius: 999px;
    background: var(--surface-color);
    color: var(--main-text);
    padding: 0.25rem 0.5rem;
    outline: none;
}

.reviews-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr));
    gap: 1rem;
}

.review-list-item {
    min-width: 0;
}

.no-matches {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem 1rem;
    border: 2px dashed var(--accent-lavender);
    border-radius: 1rem;
    text-align: center;
    font-style: italic;
    opacity: 0.9;
}

.review-list-enter-active,
.review-list-leave-active {
    transition:
        opacity 160ms ease,
        transform 160ms ease;
}

.review-list-enter-from,
.review-list-leave-to {
    opacity: 0;
    transform: translateY(4px);
}

@media (max-width: 768px) {
    .reviews-feed {
        padding: 0.75rem 0;
        gap: 0.75rem;
    }

    .review-controls {
        padding: 0.6rem;
    }

    .filter-row {
        align-items: stretch;
        flex-direction: column;
        gap: 0.6rem;
    }

    .sort-control {
        justify-content: space-between;
    }

    .sort-select {
        max-width: 12rem;
    }
}
</style>
