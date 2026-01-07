<template>
    <div class="book-fav-form">
        <div class="coming-soon-container">
            <FontAwesomeIcon :icon="faBook" class="book-icon" />
            <p class="coming-soon">book favorites coming soon!</p>
            <p class="helper-text">
                use the books shelf for now to track your reads
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { faBook } from "@fortawesome/free-solid-svg-icons";
import type { BookshelfBook } from "@/types";

defineOptions({
    name: "BookFavForm",
});

defineProps<{
    currentFavorites: BookshelfBook[] | string[];
}>();

defineEmits<{
    (e: "submit", items: BookshelfBook[]): void;
}>();
</script>

<style scoped>
.book-fav-form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 300px;
}

.coming-soon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem 2rem;
    border: 2px dashed var(--accent-lavender);
    border-radius: 1rem;
    background: color-mix(in srgb, var(--accent-lavender) 3%, transparent);
    text-align: center;
}

.book-icon {
    font-size: 3rem;
    color: var(--accent-lavender);
    opacity: 0.6;
    animation: pulse 2s ease-in-out infinite;
}

.coming-soon {
    margin: 0;
    font-family: "Libre Baskerville", serif;
    font-size: 1.25rem;
    color: var(--accent-lavender);
    font-weight: 600;
}

.helper-text {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.75;
    font-style: italic;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.6;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

@media (max-width: 768px) {
    .book-fav-form {
        min-height: 250px;
    }

    .coming-soon-container {
        padding: 2rem 1.5rem;
    }

    .book-icon {
        font-size: 2.5rem;
    }

    .coming-soon {
        font-size: 1.1rem;
    }

    .helper-text {
        font-size: 0.85rem;
    }
}
</style>
