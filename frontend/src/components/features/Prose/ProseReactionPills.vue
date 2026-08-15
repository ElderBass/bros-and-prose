<template>
    <div class="reaction-pills">
        <EmojiReactionPills
            :item="reactionSource"
            :clickable="clickable"
            :disabled="disabled"
            @select="emit('select', $event)"
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
import EmojiReactionPills from "@/components/features/common/EmojiReactionPills.vue";
import type { Comment, EmojiReactionKey, ProseEntry } from "@/types";
import { uniqueCommenterUsernames } from "@/utils/reactionDisplayUtils";

const props = defineProps<{
    entry?: ProseEntry;
    likes?: string[];
    dislikes?: string[];
    favorites?: string[];
    comments?: Comment[];
    clickable?: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: "select", reactionKey: EmojiReactionKey): void;
}>();

const reactionSource = computed(
    () =>
        props.entry ?? {
            likes: props.likes,
            dislikes: props.dislikes,
        }
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
