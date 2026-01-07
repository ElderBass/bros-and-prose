<template>
    <IconButton
        v-if="useIconButton"
        :icon="faHeart"
        :class="{ pulse: justAdded }"
        title="Add to favorites"
        color="pink"
        :size="size"
        :disabled="isDisabled"
        :handleClick="handleAddToFavorites"
    />
    <button
        v-else
        class="favorite-button"
        :disabled="isDisabled"
        :handleClick="handleAddToFavorites"
        title="Add to favorites"
    >
        <FontAwesomeIcon :icon="faHeart" :class="{ pulse: justAdded }" />
        <span class="button-text">add to favorites</span>
    </button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useUserFavorites } from "@/composables/useUserFavorites";
import { useUIStore } from "@/stores/ui";
import { QUICK_SUCCESS, QUICK_ERROR } from "@/constants/alerts";
import type { BookshelfBook } from "@/types";
import { getFavoriteBooks, isBookFavorite } from "@/utils";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{
    book: BookshelfBook;
    useIconButton: boolean;
    isBookOwner: boolean;
    size: "supersmall" | "xsmall" | "small" | "medium" | "large";
}>();

const loading = ref(false);
const justAdded = ref(false);

const isDisabled = computed(() => {
    return loading.value || isBookFavorite(props.book.id);
});

const handleAddToFavorites = async () => {
    if (isBookFavorite(props.book.id)) return;

    loading.value = true;
    try {
        let newBook = props.book;
        const currentFavorites = getFavoriteBooks();

        if (props.isBookOwner) {
            newBook = {
                ...props.book,
                id: uuidv4(),
            };
        }
        const updatedBooks = [...currentFavorites, newBook];

        await useUserFavorites().updateFavorite("books", updatedBooks);

        // Trigger pulse animation
        justAdded.value = true;
        setTimeout(() => {
            justAdded.value = false;
        }, 600);

        // Show success alert
        useUIStore().showAlert(
            QUICK_SUCCESS([
                `${props.book.title} added to favorites`,
                "look at you, all cultured and shit",
            ])
        );
    } catch (error) {
        console.error("Error adding to favorites:", error);
        useUIStore().showAlert(
            QUICK_ERROR([
                "couldn't add to favorites",
                "try again or just give up, idk",
            ])
        );
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.favorite-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 2px solid var(--accent-pink);
    border-radius: 1rem;
    color: var(--accent-pink);
    font-family: "Libre Baskerville", serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: lowercase;
}

.favorite-button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--accent-pink) 10%, transparent);
    box-shadow: 0 0 15px rgba(255, 110, 199, 0.4);
    transform: translateY(-2px);
}

.favorite-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.favorite-button svg {
    font-size: 1rem;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.favorite-button:hover:not(:disabled) svg {
    transform: scale(1.1);
}

.pulse {
    animation: heartPulse 0.6s ease-in-out;
}

@keyframes heartPulse {
    0%,
    100% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.3);
    }
    50% {
        transform: scale(1.1);
    }
    75% {
        transform: scale(1.25);
    }
}

@media (max-width: 768px) {
    .favorite-button {
        font-size: 0.75rem;
        padding: 0.4rem 0.75rem;
    }

    .favorite-button svg {
        font-size: 0.9rem;
    }
}
</style>
