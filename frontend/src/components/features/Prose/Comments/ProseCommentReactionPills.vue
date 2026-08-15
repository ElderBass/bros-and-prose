<template>
    <div v-if="hasReactions" class="comment-reaction-pills">
        <ReactionPill
            v-for="reaction in reactionBucketsFromOthers"
            :key="reaction.key"
            :type="reaction.key"
            :emoji="reaction.emoji"
            :label="reaction.label"
            :count="reaction.reactors.length"
            :reactors="reaction.reactors"
            size="xsmall"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import type { Comment } from "@/types";
import { getVisibleReactionBuckets } from "@/utils";

const props = defineProps<{
    comment: Comment;
}>();

const isNotCommentAuthor = (username: string) => {
    return username !== props.comment.userInfo.username;
};

const reactionBucketsFromOthers = computed(() =>
    getVisibleReactionBuckets(props.comment)
        .map((reaction) => ({
            ...reaction,
            reactors: reaction.reactors.filter(isNotCommentAuthor),
        }))
        .filter((reaction) => reaction.reactors.length > 0)
);

const hasReactions = computed(() => reactionBucketsFromOthers.value.length > 0);
</script>

<style scoped>
.comment-reaction-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
