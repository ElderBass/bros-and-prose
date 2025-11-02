<template>
    <div v-if="book" class="book-info-content">
        <img
            :src="book?.imageSrc"
            :alt="book?.title"
            :class="{ 'cover-image': !isLink, 'cover-image-link': isLink }"
        />
        <div class="book-info-container" :class="{ 'link-layout': isLink }">
            <h3 class="book-title" :class="{ 'link-book-title': isLink }">
                {{ book?.title }}
            </h3>
            <div class="book-info-items">
                <div
                    class="info-item"
                    :class="{ 'link-info-item': isLink }"
                    v-for="item in bookInfoItems"
                    :key="item.label"
                >
                    <p v-if="!isLink">{{ item.label }}</p>
                    <p
                        class="info-value"
                        :class="{ 'link-info-value': isLink }"
                    >
                        {{ item.value }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        book: Book | null;
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
            value: props.book?.author || "unknown",
        },
        {
            label: "published",
            value: props.book?.yearPublished || "unknown",
        },
        {
            label: "pages",
            value: props.book?.totalPages || "unknown",
        },

        {
            label: "goodreads score",
            value: props.book?.goodreadsRating || "unknown",
        },
    ];
    return props.isLink ? fullList.slice(0, 1) : fullList;
});
</script>

<style scoped>
.book-info-content {
    flex: 1;
    height: 100%;
    display: flex;
    gap: 1rem;
}

.cover-image {
    max-width: 120px;
    object-fit: cover;
}

.cover-image-link {
    max-width: 80px;
    object-fit: cover;
}

.book-info-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.book-title {
    width: 100%;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    text-align: right;
}

.link-book-title {
    font-size: 1.5rem;
}

.book-info-items {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: space-between;
    text-align: right;
    width: 100%;
}

.link-layout {
    justify-content: space-evenly;
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
    .book-info-content {
        gap: 3rem;
    }
    .cover-image {
        max-width: 200px;
    }
    .book-title {
        font-size: 2.25rem;
    }
    p {
        font-size: 1.5rem;
    }
    .info-value {
        font-size: 1.5rem;
    }
}
</style>
