<template>
    <div class="book-rating-input">
        <h6>how'd you like this book?</h6>
        <div class="book-rating-container">
            <div
                v-for="book in 10"
                :key="book"
                class="book-wrapper"
                @click="handleBookClick(book)"
                @mousemove="handleMouseMove(book)"
                @mouseleave="handleMouseLeave"
            >
                <FontAwesomeIcon :icon="faBook" :class="getBookClass(book)" />
            </div>
        </div>
        <div class="rating-message-container">
            <p class="rating-message">
                {{ ratingMessage }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const ratingMap = {
    1: "burn it",
    2: "yikes",
    3: "oof",
    4: "meh",
    5: "solid",
    6: "rock solid",
    7: "excellent",
    8: "superb",
    9: "truly exceptional",
    10: "would read again",
};

const props = withDefaults(
    defineProps<{
        modelValue: number;
        disabled?: boolean;
        size?: "small" | "medium" | "large";
    }>(),
    {
        disabled: false,
        showValue: false,
        size: "medium",
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: number];
}>();

const hoverRating = ref(0);
const isHovering = ref(false);

const ratingMessage = computed(() => {
    return ratingMap[props.modelValue as keyof typeof ratingMap];
});

const displayRating = computed(() => {
    return isHovering.value ? hoverRating.value : props.modelValue;
});

const getBookClass = (bookValue: number): string => {
    const currentRating = displayRating.value;

    if (currentRating >= bookValue) {
        return "book-filled";
    } else {
        return "book-empty";
    }
};

const handleBookClick = (book: number) => {
    if (props.disabled) return;

    emit("update:modelValue", book);
};

const handleMouseMove = (book: number) => {
    if (props.disabled) return;

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
}

.book-wrapper:hover {
    transform: scale(1.1);
}

.book-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.book-wrapper.disabled:hover {
    transform: none;
}

/* Size variants */
.book-rating-container {
    font-size: 1.5rem; /* medium default */
}

.book-rating-input[data-size="small"] .book-rating-container {
    font-size: 1rem;
}

.book-rating-input[data-size="medium"] .book-rating-container {
    font-size: 1.5rem;
}

.book-rating-input[data-size="large"] .book-rating-container {
    font-size: 2rem;
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

/* Hover effects */
.book-wrapper:hover .book-empty {
    color: var(--accent-fuschia);
    opacity: 0.6;
}

.book-wrapper:hover .book-filled {
    color: var(--accent-blue);
    filter: drop-shadow(0 0 4px var(--accent-blue));
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

    .book-wrapper:hover {
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
