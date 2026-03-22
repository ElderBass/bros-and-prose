<template>
    <div class="reaction-pills">
        <ReactionPill type="like" :count="likes?.length || 0" />
        <ReactionPill type="dislike" :count="dislikes?.length || 0" />
        <ReactionPill type="favorite" :count="favorites?.length || 0" />
        <ReactionPill type="comment" :count="comments?.length || 0" />
    </div>
</template>

<script setup lang="ts">
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import type { Comment } from "@/types";

defineProps<{
    likes?: string[];
    dislikes?: string[];
    favorites?: string[];
    comments?: Comment[];
}>();
</script>

<style scoped>
.reaction-pills {
    width: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}
</style>
