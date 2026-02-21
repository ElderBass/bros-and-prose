<template>
    <div class="book-info-items" :class="{ 'book-info-items-link': isLink }">
        <div
            class="info-item"
            :class="{ 'link-info-item': isLink }"
            v-for="item in bookInfoItems"
            :key="item.label"
        >
            <p v-if="!isLink">{{ item.label }}</p>
            <p class="info-value" :class="{ 'link-info-value': isLink }">
                {{ item.value }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        book: Book;
        isLink?: boolean;
    }>(),
    {
        isLink: false,
    }
);

const bookInfoItems = computed(() => {
    const fullList = [
        {
            label: "author",
            value: props.book.author || "unknown",
        },
        {
            label: "published",
            value: props.book.yearPublished || "unknown",
        },
        {
            label: "pages",
            value: props.book.totalPages || "unknown",
        },

        {
            label: "goodreads score",
            value: props.book.goodreadsRating || "unknown",
        },
    ];
    return props.isLink ? fullList.slice(0, 2) : fullList;
});
</script>

<style scoped>
.book-info-items {
    display: flex;
    align-self: flex-end;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-end;
    text-align: right;
    width: 70%;
}

.book-info-items-link {
    width: 90%;
}

p {
    font-size: 0.85rem;
}

.info-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.link-info-item {
    gap: 2rem;
    justify-content: flex-end;
}

.info-value {
    font-size: 1rem;
    font-weight: 600;
    color: var(--accent-blue);
}

.link-info-value {
    font-size: 1rem;
}

@media (min-width: 768px) {
    p {
        font-size: 1.5rem;
    }
    .info-value {
        font-size: 1.5rem;
    }
    .link-info-value {
        font-size: 1.25rem;
    }
}
</style>
