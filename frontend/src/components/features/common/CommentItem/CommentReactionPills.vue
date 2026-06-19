<template>
    <div v-if="hasReactions" class="comment-reaction-pills">
        <ReactionPill
            type="like"
            :count="likes.length"
            :reactors="likes"
            size="xsmall"
        />
        <ReactionPill
            type="dislike"
            :count="dislikes.length"
            :reactors="dislikes"
            size="xsmall"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import type { Comment } from "@/types";

const props = defineProps<{
    comment: Comment;
}>();

const likes = computed(() => props.comment.likes ?? []);
const dislikes = computed(() => props.comment.dislikes ?? []);

const hasReactions = computed(
    () => likes.value.length > 0 || dislikes.value.length > 0
);
</script>

<style scoped>
.comment-reaction-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
