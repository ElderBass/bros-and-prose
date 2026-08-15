<template>
    <div class="reaction-pills">
        <ReactionPill
            v-for="reaction in reactionBuckets"
            :key="reaction.key"
            :type="reaction.key"
            :emoji="reaction.emoji"
            :label="reaction.label"
            :count="reaction.reactors.length"
            :reactors="reaction.reactors"
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
import { getVisibleReactionBuckets } from "@/utils";

const props = defineProps<{
    entry?: ProseEntry;
    likes?: string[];
    dislikes?: string[];
    favorites?: string[];
    comments?: Comment[];
}>();

const reactionSource = computed(
    () =>
        props.entry ?? {
            likes: props.likes,
            dislikes: props.dislikes,
        }
);

const reactionBuckets = computed(() =>
    getVisibleReactionBuckets(reactionSource.value)
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
