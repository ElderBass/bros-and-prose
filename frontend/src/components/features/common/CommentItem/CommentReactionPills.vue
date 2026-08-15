<template>
    <div v-if="hasReactions" class="comment-reaction-pills">
        <ReactionPill
            v-for="reaction in reactionBuckets"
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

const reactionBuckets = computed(() =>
    getVisibleReactionBuckets(props.comment)
);

const hasReactions = computed(() => reactionBuckets.value.length > 0);
</script>

<style scoped>
.comment-reaction-pills {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
}
</style>
