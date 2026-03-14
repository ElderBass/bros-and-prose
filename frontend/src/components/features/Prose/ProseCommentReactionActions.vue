<template>
    <div class="reaction-actions">
        <ReactionButton
            v-for="reaction in REACTION_TYPES"
            :key="reaction"
            :type="reaction"
            :isChildComment="true"
            :reactions="getReactions(reaction, comment)"
            :onClick="() => handleReaction(reaction)"
        />
    </div>
</template>

<script setup lang="ts">
import ReactionButton from "@/components/features/Palaver/PalaverListItem/ReactionButton.vue";
import type { Comment, ProseEntry, ReactionType } from "@/types";
import { REACTION_TYPES } from "@/constants";
import {
    LIKED_PALAVER_ENTRY_SUCCESS_ALERT,
    DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT,
} from "@/constants";
import { getReactions } from "@/utils";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    comment: Comment;
    entry: ProseEntry;
}>();

const { likeComment, dislikeComment } = useProse();
const { error: logError, info: logInfo } = useLog();
const { showAlert } = useUIStore();

const handleReaction = async (reaction: ReactionType) => {
    try {
        if (reaction === "like") {
            await likeComment(props.entry, props.comment);
            await logInfo(`Liked prose comment: ${props.comment.id}`);
            showAlert(LIKED_PALAVER_ENTRY_SUCCESS_ALERT);
        } else {
            await dislikeComment(props.entry, props.comment);
            await logInfo(`Disliked prose comment: ${props.comment.id}`);
            showAlert(DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT);
        }
    } catch (error) {
        console.error(error);
        await logError(`Error reacting to prose comment: ${props.comment.id}`);
    }
};
</script>

<style scoped>
.reaction-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>
