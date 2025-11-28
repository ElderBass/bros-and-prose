<template>
    <div class="inbrospection-section">
        <PageTitle title="inbrospection..." />

        <div v-if="discussionItems.length" class="comments-list">
            <PalaverListItem
                v-for="item in discussionItems"
                :key="item.id"
                :entry="item"
                :isInbrospection="true"
            />
        </div>

        <div v-else class="no-comments">
            <p>no inbrospection yet — be the first to drop a thought</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import type { Book, PalaverEntry } from "@/types";
import PalaverListItem from "@/components/features/Palaver/PalaverListItem/index.vue";
import { getPalaverCommentsForBook } from "@/utils";

const props = defineProps<{
    book: Book;
}>();

const discussionItems = computed(
    () => getPalaverCommentsForBook(props.book.id) as PalaverEntry[]
);
</script>

<style scoped>
.inbrospection-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
    border: 2px solid var(--accent-fuschia);
    border-radius: 1rem;
    padding: 1rem;
    background: linear-gradient(
        180deg,
        rgba(255, 77, 255, 0.06),
        rgba(255, 77, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(255, 77, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.comment-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--accent-lavender);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.avatar {
    flex-shrink: 0;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
}

.username {
    color: var(--accent-fuschia);
    font-size: 1.25rem;
    font-weight: 600;
}

.dot {
    opacity: 0.6;
}

.timestamp {
    font-size: 0.9rem;
}

.text {
    margin: 0;
    line-height: 1.6;
}

.no-comments {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    padding: 2rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.no-comments p {
    margin: 0;
    font-style: italic;
    opacity: 0.85;
}

@media (max-width: 768px) {
    .comment-item {
        padding: 0.75rem;
    }
}
</style>
