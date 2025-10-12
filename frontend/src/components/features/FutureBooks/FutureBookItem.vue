<template>
    <BaseCard shadow-color="lavender" size="medium">
        <div class="future-book-item">
            <div class="cover-and-info">
                <img class="cover" :src="book.imageSrc" :alt="book.title" />
                <div class="info">
                    <h3 class="title">{{ book.title }}</h3>
                    <p class="author">{{ book.author }}</p>
                    <p class="meta">{{ book.yearPublished }}</p>
                    <div class="tags" v-if="book.tags?.length">
                        <BookTag
                            v-for="tag in book.tags"
                            :key="tag"
                            :tag="tag"
                            :selected="true"
                            color="blue"
                        />
                    </div>
                </div>
            </div>

            <p class="description">{{ book.description }}</p>

            <div class="actions">
                <div class="votes">
                    <span class="count">{{ book.votes }}</span>
                    <span class="label">votes</span>
                </div>
                <BaseButton
                    v-if="!userIsFutureBookSelector"
                    variant="outline-success"
                    size="small"
                    title="vote for this book"
                    @click="handleVote"
                >
                    vote
                </BaseButton>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";
import { useUserStore } from "@/stores/user";
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BookTag from "@/components/ui/BookTag.vue";
// import { useBooks } from "@/composables/useBooks";

const { userIsFutureBookSelector } = useUserStore();

defineProps<{
    book: FutureBook;
}>();

const handleVote = () => {
    console.log("vote");
};
</script>

<style scoped>
.future-book-item {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cover-and-info {
    display: flex;
    gap: 1rem;
}

.cover {
    width: 80px;
    height: 110px;
    object-fit: cover;
    border-radius: 0.5rem;
}

.info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.title {
    margin: 0;
    color: var(--accent-fuschia);
    font-style: italic;
    font-family: "Libre Baskerville", serif;
}

.author,
.meta {
    margin: 0;
    opacity: 0.85;
}

.tags {
    display: flex;
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
}

.actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.votes {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
}

.count {
    font-size: 1.125rem;
    font-weight: 700;
}

.label {
    opacity: 0.8;
}

@media (max-width: 768px) {
    .cover {
        width: 64px;
        height: 88px;
    }
}
</style>
