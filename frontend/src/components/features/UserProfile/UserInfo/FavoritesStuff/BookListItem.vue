<template>
    <div
        class="book-badge"
        :class="{
            selected: selectable && selected,
            disabled: selectable && disabled,
        }"
        @click="handleClick"
    >
        <!-- Selection indicator (only when selectable) -->
        <div v-if="selectable" class="selection-indicator">
            <FontAwesomeIcon
                :icon="selected ? faCheckCircle : faCircle"
                :class="{ checked: selected }"
            />
        </div>

        <div class="badge-thumbnail">
            <img
                v-if="book.imageSrc"
                :src="book.imageSrc"
                :alt="book.title"
                class="thumbnail-image"
            />
            <div v-else class="thumbnail-placeholder">
                <FontAwesomeIcon :icon="faBook" class="placeholder-icon" />
            </div>
        </div>
        <div class="badge-content">
            <h4 class="badge-title">{{ truncatedTitle }}</h4>
            <p class="badge-author">{{ truncatedAuthor }}</p>
            <span v-if="selectable && disabled" class="already-favorite-badge">
                already a favorite
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faBook,
    faCheckCircle,
    faCircle,
} from "@fortawesome/free-solid-svg-icons";
import type { BookshelfBook } from "@/types";

const props = withDefaults(
    defineProps<{
        book: BookshelfBook;
        selected?: boolean;
        disabled?: boolean;
        selectable?: boolean;
    }>(),
    {
        selected: false,
        disabled: false,
        selectable: false,
    }
);

const emit = defineEmits<{
    (e: "click", book: BookshelfBook): void;
}>();

const truncatedTitle = computed(() => {
    if (props.book.title.length > 30) {
        return props.book.title.substring(0, 30) + "...";
    }
    return props.book.title;
});

const truncatedAuthor = computed(() => {
    if (props.book.author.length > 20) {
        return props.book.author.substring(0, 20) + "...";
    }
    return props.book.author;
});

const handleClick = () => {
    if (props.selectable && props.disabled) {
        return; // Don't emit if disabled
    }
    emit("click", props.book);
};
</script>

<style scoped>
.book-badge {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    border: 2px solid var(--accent-fuschia);
    border-radius: 0.75rem;
    background: linear-gradient(
        180deg,
        var(--surface-color),
        color-mix(in srgb, var(--surface-color) 90%, var(--accent-fuschia))
    );
    box-shadow:
        0 4px 12px rgba(255, 77, 255, 0.2),
        0 0 20px rgba(255, 77, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    max-width: 300px;
    min-width: 200px;
    min-height: 72px;
}

.book-badge:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow:
        0 8px 24px rgba(255, 77, 255, 0.35),
        0 0 40px rgba(255, 77, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Selection indicator */
.selection-indicator {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    font-size: 1.1rem;
    color: var(--accent-blue);
    transition: all 0.3s ease;
    z-index: 1;
}

.selection-indicator .checked {
    color: var(--accent-fuschia);
}

/* Selected state */
.book-badge.selected {
    border-color: var(--accent-fuschia);
    box-shadow:
        0 4px 20px rgba(255, 77, 255, 0.3),
        0 0 30px rgba(255, 77, 255, 0.15);
}

/* Disabled state */
.book-badge.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: var(--text-muted);
}

.book-badge.disabled:hover {
    transform: none;
    box-shadow:
        0 4px 12px rgba(255, 77, 255, 0.2),
        0 0 20px rgba(255, 77, 255, 0.1);
}

.badge-thumbnail {
    padding: 0.25rem;
    width: 100%;
    height: 100%;
    max-width: 40px;
    position: relative;
    overflow: hidden;
    align-content: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.thumbnail-image {
    width: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
}

.thumbnail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-fuschia) 15%, transparent),
        color-mix(in srgb, var(--accent-fuschia) 8%, transparent)
    );
    border-bottom: 1px solid var(--accent-fuschia);
}

.placeholder-icon {
    font-size: 2rem;
    color: var(--accent-fuschia);
    opacity: 0.5;
}

.badge-content {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2rem;
    overflow: hidden;
}

.badge-title {
    margin: 0;
    font-family: "Courier New", serif;
    font-style: italic;
    font-size: 0.8rem;
    color: var(--accent-fuschia);
    font-weight: 600;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
}

.badge-author {
    margin: 0;
    font-size: 0.7rem;
    color: var(--accent-green);
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.already-favorite-badge {
    margin-top: 0.15rem;
    padding: 0.2rem 0.4rem;
    font-size: 0.65rem;
    font-style: italic;
    color: var(--accent-green);
    background: color-mix(in srgb, var(--accent-green) 15%, transparent);
    border-radius: 0.25rem;
    border: 1px solid var(--accent-green);
}

@media (max-width: 768px) {
    .book-badge {
        max-width: 100%;
        min-width: 100%;
        min-height: 80px;
    }

    .badge-thumbnail {
        max-width: 50px;
    }

    .badge-content {
        padding: 0.5rem;
    }

    .badge-title {
        font-size: 0.85rem;
    }

    .badge-author {
        font-size: 0.75rem;
    }

    .placeholder-icon {
        font-size: 2rem;
    }
}
</style>
