<template>
    <div class="future-book-item-info">
        <div class="cover-and-info">
            <img class="cover" :src="book.imageSrc" :alt="book.title" />
            <div class="info">
                <h3 class="title">{{ book.title }}</h3>
                <div class="author-and-meta">
                    <p class="author">{{ book.author }}</p>
                    <span class="separator">|</span>
                    <p class="meta">{{ book.yearPublished }}</p>
                </div>

                <a :href="goodreadsUrl" target="_blank" class="goodreads-link">
                    peep goodreads
                    <FontAwesomeIcon :icon="faGlasses" />
                </a>
                <div class="tags" v-if="book.tags?.length">
                    <BookTag
                        v-for="tag in book.tags"
                        :key="tag"
                        :tag="tag"
                        :selected="true"
                        color="blue"
                        :size="isMobile ? 'small' : 'medium'"
                    />
                </div>
            </div>
        </div>
        <p class="description">{{ book.description }}</p>
    </div>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";
import { computed } from "vue";
import { faGlasses } from "@fortawesome/free-solid-svg-icons";
import BookTag from "@/components/ui/BookTag.vue";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const { isMobile } = storeToRefs(useUIStore());

const props = defineProps<{
    book: FutureBook;
}>();

const goodreadsUrl = computed(() => {
    const q = [props.book.title, props.book.author].filter(Boolean).join(" ");
    return `https://www.goodreads.com/search?q=${encodeURIComponent(q)}`;
});
</script>

<style scoped>
.future-book-item-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cover-and-info {
    display: flex;
    gap: 1rem;
}

.cover {
    flex: 1 0 40%;
    min-width: 100px;
    max-height: 280px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 1.25rem;
    text-align: right;
}

.title {
    margin: 0;
    font-size: 1.5rem;
    font-style: italic;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    text-align: right;
}

.author,
.meta {
    margin: 0;
    opacity: 0.85;
}

.author-and-meta {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25rem;
}

.separator {
    color: var(--accent-blue);
    font-size: 1.25rem;
    font-weight: 600;
}

.goodreads-link {
    color: var(--accent-lavender);
    text-decoration: underline;
    margin: 0.25rem 0;
}

.goodreads-link:hover {
    color: var(--accent-fuschia);
}

.goodreads-link:hover .fa-glasses {
    color: var(--accent-fuschia);
}

.tags {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.description {
    margin: 0;
    opacity: 0.9;
    border-top: 2px solid var(--accent-blue);
    border-left: 2px solid var(--accent-blue);
    border-top-left-radius: 1rem;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-size: 1.125rem;
}

@media (max-width: 768px) {
    .cover-and-info {
        gap: 0.5rem;
    }

    .cover {
        width: 64px;
        min-width: 64px;
    }

    .separator {
        font-size: 1rem;
    }

    .title {
        font-size: 1.25rem;
    }

    .info {
        font-size: 0.9rem;
    }

    .goodreads-link {
        font-size: 0.95rem;
    }

    .tags {
        transform: scale(0.9);
        gap: 0.125rem;
        margin-right: -0.5rem;
    }

    .description {
        font-size: 1rem;
        padding: 0.375rem;
        margin-top: 0.375rem;
    }
}
</style>
