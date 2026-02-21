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
import type { Comment, ReactionType } from "@/types";
import { REACTION_TYPES } from "@/constants";
import {
    LIKED_PALAVER_ENTRY_SUCCESS_ALERT,
    DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT,
} from "@/constants";
import { getReactions } from "@/utils";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    comment: Comment;
    entryId: string;
}>();

const { likeComment, dislikeComment } = usePalaver();
const { error: logError, info: logInfo } = useLog();
const { showAlert } = useUIStore();

const handleReaction = async (reaction: ReactionType) => {
    try {
        if (reaction === "like") {
            await likeComment(props.comment, props.entryId);
            await logInfo(`Liked comment: ${props.comment.id}`);
            showAlert(LIKED_PALAVER_ENTRY_SUCCESS_ALERT);
        } else {
            await dislikeComment(props.comment, props.entryId);
            await logInfo(`Disliked comment: ${props.comment.id}`);
            showAlert(DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT);
        }
    } catch (error) {
        console.error(error);
        await logError(`Error liking comment: ${props.comment.id}`);
    }
};
</script>

<style scoped>
.reaction-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-right: 0.5rem;
    margin-right: -0.5rem;
}

@media (max-width: 768px) {
    .reaction-actions {
        gap: 0.5rem;
    }
}
</style>
