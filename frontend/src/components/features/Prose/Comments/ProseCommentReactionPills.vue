<template>
    <div v-if="hasReactions" class="comment-reaction-pills">
        <ReactionPill
            type="like"
            :count="likesFromOthers.length"
            :reactors="likesFromOthers"
            size="xsmall"
        />
        <ReactionPill
            type="dislike"
            :count="dislikesFromOthers.length"
            :reactors="dislikesFromOthers"
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

const isNotCommentAuthor = (username: string) => {
    return username !== props.comment.userInfo.username;
};

const likesFromOthers = computed(() =>
    (props.comment.likes ?? []).filter(isNotCommentAuthor)
);

const dislikesFromOthers = computed(() =>
    (props.comment.dislikes ?? []).filter(isNotCommentAuthor)
);

const hasReactions = computed(
    () =>
        likesFromOthers.value.length > 0 || dislikesFromOthers.value.length > 0
);
</script>

<style scoped>
.comment-reaction-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
