<template>
    <section class="comments-section">
        <p v-if="!comments.length" class="empty-copy">
            no comments yet — be the first to join the palaver.
        </p>
        <div v-else class="comments-list">
            <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :entryId="entry.id"
                :comment="comment"
                :size="commentSize"
                :variant="variant"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PalaverEntry } from "@/types/palaver";
import type { Comment } from "@/types";
import CommentItem from "@/components/features/common/CommentItem/index.vue";

const props = withDefaults(
    defineProps<{
        entry: PalaverEntry;
        variant?: "lavender" | "fuschia" | "blue" | "green" | "red";
        commentSize?: "default" | "compact";
    }>(),
    {
        variant: "lavender",
        commentSize: "compact",
    }
);

console.log("commentSize", props.commentSize);

const comments = computed<Comment[]>(() => props.entry.comments || []);
</script>

<style scoped>
.comments-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
}

.empty-copy {
    margin: 0;
    opacity: 0.65;
    font-size: 0.9rem;
    font-style: italic;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
</style>
