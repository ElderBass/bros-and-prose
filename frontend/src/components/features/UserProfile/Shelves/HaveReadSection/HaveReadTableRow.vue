<template>
    <div
        class="row"
        role="button"
        tabindex="0"
        :title="`peep details for ${book.title}`"
        @click="emit('open', book)"
        @keydown.enter.prevent="emit('open', book)"
        @keydown.space.prevent="emit('open', book)"
    >
        <div class="cell title">
            <span class="title-text">{{ book.title }}</span>
        </div>
        <div class="cell author">{{ book.author }}</div>
        <div class="cell year">{{ book.yearPublished || "—" }}</div>
        <div class="cell pages">{{ book.pages || "—" }}</div>
        <div class="cell tags">
            <span v-if="tagSummary" class="tag-summary">{{ tagSummary }}</span>
            <span v-else class="muted italics">no tags</span>
        </div>
        <div class="cell review">
            <span v-if="review" class="rating-pill" :style="ratingPillStyle">
                {{ review.rating }}/10
            </span>
            <span v-else class="muted italics">nunya</span>
        </div>

        <!-- Favorite column -->
        <div class="cell favorite" @click.stop>
            <IconButton
                v-if="isLoggedInUser"
                :icon="isFavorited ? faHeartSolid : faHeartRegular"
                size="xsmall"
                color="pink"
                shadow-color="pink"
                :title="
                    isFavorited ? 'Remove from favorites' : 'Add to favorites'
                "
                :handleClick="handleFavoriteToggle"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook, Review } from "@/types";
import { getReviewThemeColor, isBookFavorite, getFavoriteBooks } from "@/utils";
import { useUserFavorites } from "@/composables/useUserFavorites";
import { useUIStore } from "@/stores/ui";
import { QUICK_SUCCESS, QUICK_ERROR } from "@/constants/alerts";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";

const props = defineProps<{
    book: BookshelfBook;
    review: Review | null;
    isLoggedInUser?: boolean;
}>();

const emit = defineEmits<{
    (e: "open", book: BookshelfBook): void;
}>();

const isFavorited = computed(() => isBookFavorite(props.book.id));

const tagSummary = computed(() => {
    const tags = props.book.tags || [];
    if (!tags.length) return "";
    const shown = tags.slice(0, 2).join(", ");
    const rest = tags.length - 2;
    return rest > 0 ? `${shown} +${rest}` : shown;
});

const ratingPillStyle = computed(() => {
    if (!props.review) return {};
    const theme = getReviewThemeColor(props.review.rating);
    return {
        borderColor: theme,
        backgroundColor: `color-mix(in srgb, ${theme} 16%, transparent)`,
        color: theme,
    };
});

const handleFavoriteToggle = async () => {
    if (!props.isLoggedInUser) return;

    try {
        const currentFavorites = getFavoriteBooks();
        const wasFavorited = isBookFavorite(props.book.id);

        let updatedBooks;
        if (wasFavorited) {
            // Remove from favorites
            updatedBooks = currentFavorites.filter(
                (b) => b.id !== props.book.id
            );
            await useUserFavorites().updateFavorite("books", updatedBooks);

            useUIStore().showAlert(
                QUICK_SUCCESS([
                    `${props.book.title} removed from favorites`,
                    "tough crowd, huh?",
                ])
            );
        } else {
            // Add to favorites
            updatedBooks = [...currentFavorites, props.book];
            await useUserFavorites().updateFavorite("books", updatedBooks);

            useUIStore().showAlert(
                QUICK_SUCCESS([
                    `${props.book.title} added to favorites`,
                    "look at you, all cultured and shit",
                ])
            );
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        useUIStore().showAlert(
            QUICK_ERROR([
                "couldn't update favorites",
                "try again or just give up, idk",
            ])
        );
    }
};
</script>

<style scoped>
.row {
    display: grid;
    grid-template-columns: 2fr 1.4fr 0.6fr 0.6fr 1.2fr 0.8fr 0.5fr;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid
        color-mix(in srgb, var(--accent-green) 35%, transparent);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
}

.row:hover {
    background-color: color-mix(in srgb, var(--accent-green) 10%, transparent);
}

.row:focus-visible {
    outline: 2px solid var(--accent-green);
    outline-offset: -2px;
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
}

.title-text {
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    font-weight: 600;
}

.author {
    color: var(--accent-blue);
}

.rating-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.45rem;
    border-radius: 999px;
    border: 1px solid var(--accent-green);
    background-color: color-mix(in srgb, var(--accent-green) 12%, transparent);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--main-text);
}

.tags {
    color: var(--accent-blue);
}

.muted {
    opacity: 0.75;
    color: var(--main-text);
}

.italics {
    font-style: italic;
}

.cell.favorite {
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem;
        align-items: flex-start;
        justify-content: space-between;
    }

    .cell {
        font-size: 0.95rem;
        white-space: normal;
    }

    /* Title and favorite on same row - centered vertically, space between */
    .cell.title {
        flex: 1 1 auto;
        min-width: 0;
        max-width: calc(100% - 3rem);
        order: 1;
        display: flex;
        align-items: center;
    }

    .cell.favorite {
        flex: 0 0 auto;
        order: 2;
        display: flex;
        align-items: center;
    }

    /* Rest of the cells below - full width */
    .cell.author {
        flex: 1 1 100%;
        order: 3;
    }

    .cell.year {
        flex: 0 1 50%;
        order: 4;
    }

    .cell.pages {
        flex: 0 1 50%;
        order: 5;
    }

    .cell.tags {
        flex: 1 1 100%;
        order: 6;
    }

    .cell.review {
        flex: 1 1 100%;
        order: 7;
    }

    .review,
    .tags,
    .year,
    .pages {
        font-size: 0.85rem;
        opacity: 0.9;
    }
}
</style>
