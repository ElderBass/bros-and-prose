<template>
    <div class="book-rating-input" :data-size="size">
        <h6 v-if="!readOnly">how'd you like this book?</h6>
        <div class="book-rating-container">
            <div
                v-for="book in 10"
                :key="book"
                :class="['book-wrapper', { disabled: readOnly }]"
                @click="handleBookClick(book)"
                @mousemove="handleMouseMove(book)"
                @mouseleave="handleMouseLeave"
            >
                <FontAwesomeIcon :icon="faBook" :class="getBookClass(book)" />
            </div>
        </div>
        <div class="rating-message-container">
            <p class="rating-message">"{{ ratingMessage }}"</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { RATING_MAP } from "@/constants";

const props = withDefaults(
    defineProps<{
        modelValue: number;
        readOnly?: boolean;
        size?: "xsmall" | "small" | "medium" | "large";
    }>(),
    {
        readOnly: false,
        size: "medium",
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: number];
}>();

const hoverRating = ref(0);
const isHovering = ref(false);

const ratingMessage = computed(() => {
    if (isHovering.value && !props.readOnly) {
        return RATING_MAP[hoverRating.value as keyof typeof RATING_MAP];
    }
    return RATING_MAP[props.modelValue as keyof typeof RATING_MAP];
});

const displayRating = computed(() => {
    return isHovering.value ? hoverRating.value : props.modelValue;
});

const getBookClass = (bookValue: number): string => {
    const currentRating = displayRating.value;

    let bookClass = "";

    if (currentRating >= bookValue) {
        bookClass = "book-filled";
    } else {
        bookClass = "book-empty";
    }

    if (props.readOnly) {
        bookClass += " disabled";
    }

    return bookClass;
};

const handleBookClick = (book: number) => {
    if (props.readOnly) return;

    emit("update:modelValue", book);
};

const handleMouseMove = (book: number) => {
    if (props.readOnly) return;

    hoverRating.value = book;
    isHovering.value = true;
};

const handleMouseLeave = () => {
    isHovering.value = false;
    hoverRating.value = 0;
};
</script>

<style scoped>
.book-rating-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
}

h6 {
    font-size: 1.25rem;
    color: var(--main-text);
    border-bottom: 1px solid var(--accent-blue);
    margin-bottom: 0.5rem;
    text-align: left;
}

.book-rating-container {
    display: flex;
    gap: 0.25rem;
    cursor: pointer;
    user-select: none;
}

.book-wrapper {
    position: relative;
    display: flex;
    transition: transform 0.2s ease;
    font-size: 1.5rem; /* medium default */
}

.book-rating-input[data-size="xsmall"] {
    gap: 0.15rem;
}

.book-rating-input[data-size="small"] {
    gap: 0.25rem;
}

.book-rating-input[data-size="medium"] {
    gap: 0.5rem;
}

.book-rating-input[data-size="large"] {
    gap: 0.75rem;
}

.book-rating-input[data-size="xsmall"] .book-wrapper {
    font-size: 0.85rem;
}

.book-rating-input[data-size="small"] .book-wrapper {
    font-size: 1.1rem;
}

.book-rating-input[data-size="medium"] .book-wrapper {
    font-size: 1.25rem;
}

.book-rating-input[data-size="large"] .book-wrapper {
    font-size: 1.75rem;
}

.book-wrapper:hover {
    transform: scale(1.1);
}

.book-wrapper.disabled {
    cursor: default;
}

.book-wrapper.disabled:hover {
    transform: none;
}

.book-rating-container {
    font-size: inherit;
}

/* Book states */
.book-empty {
    color: var(--slate-gray);
    opacity: 0.3;
}

.book-filled {
    color: var(--accent-lavender);
    opacity: 1;
}

/* Hover effects - only when not disabled */
.book-wrapper:not(.disabled):hover .book-empty {
    color: var(--accent-fuschia);
    opacity: 0.6;
}

.book-wrapper:not(.disabled):hover .book-filled {
    color: var(--accent-blue);
    filter: drop-shadow(0 0 4px var(--accent-blue));
}

/* Disabled state - no hover effects */
.book-wrapper.disabled:hover .book-empty,
.book-wrapper.disabled:hover .book-filled {
    color: inherit;
    opacity: inherit;
    filter: none;
}

.rating-message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 2rem;
}

.rating-message {
    font-size: 1.125rem;
    text-align: center;
    color: var(--accent-blue);
    font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .book-rating-container {
        gap: 0.125rem;
    }

    .book-wrapper:not(.disabled):hover {
        transform: scale(1.05);
    }

    h6 {
        font-size: 1.125rem;
    }

    .rating-message {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    h6 {
        font-size: 1rem;
    }

    .rating-message {
        font-size: 0.875rem;
    }

    .book-rating-container {
        gap: 0.1rem;
    }
}

/* Accessibility */
.book-wrapper:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
    border-radius: 0.25rem;
}

/* Animation for rating changes */
.book-filled,
.book-half-filled {
    transition: all 0.2s ease;
}
</style>
