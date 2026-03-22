<template>
    <div class="reaction-pills">
        <ReactionPill
            type="like"
            :count="likesList.length"
            :reactors="likesList"
        />
        <ReactionPill
            type="dislike"
            :count="dislikesList.length"
            :reactors="dislikesList"
        />
        <ReactionPill
            type="favorite"
            :count="favoritesList.length"
            :reactors="favoritesList"
        />
        <ReactionPill
            type="comment"
            :count="commentsList.length"
            :reactors="commentUsernames"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import type { Comment, ProseEntry } from "@/types";
import { uniqueCommenterUsernames } from "@/utils/reactionDisplayUtils";

const props = defineProps<{
    entry?: ProseEntry;
    likes?: string[];
    dislikes?: string[];
    favorites?: string[];
    comments?: Comment[];
}>();

const likesList = computed(() => props.likes ?? props.entry?.likes ?? []);

const dislikesList = computed(
    () => props.dislikes ?? props.entry?.dislikes ?? []
);

const favoritesList = computed(
    () => props.favorites ?? props.entry?.favorites ?? []
);

const commentsList = computed(
    () => props.comments ?? props.entry?.comments ?? []
);

const commentUsernames = computed(() =>
    uniqueCommenterUsernames(commentsList.value)
);
</script>

<style scoped>
.reaction-pills {
    width: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
