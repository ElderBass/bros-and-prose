<template>
    <div class="reaction-actions">
        <ReactionMenu
            :item="comment"
            :isChildComment="true"
            @select="handleReaction"
        />
    </div>
</template>

<script setup lang="ts">
import ReactionMenu from "@/components/features/Palaver/PalaverListItem/ReactionMenu.vue";
import type { Comment, EmojiReactionKey } from "@/types";
import { QUICK_SUCCESS } from "@/constants";
import { getEmojiReactionOption } from "@/utils";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    comment: Comment;
    entryId: string;
}>();

const { togglePalaverCommentReaction } = usePalaver();
const { error: logError, info: logInfo } = useLog();
const { showAlert } = useUIStore();

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    try {
        await togglePalaverCommentReaction(
            props.comment,
            props.entryId,
            reactionKey
        );
        const reaction = getEmojiReactionOption(reactionKey);
        await logInfo(`Reacted to comment: ${props.comment.id}`);
        showAlert(
            QUICK_SUCCESS([
                "reaction updated successfully.",
                `${reaction?.emoji || ""} ${reaction?.label || "reaction"}`,
            ])
        );
    } catch (error) {
        console.error(error);
        await logError(`Error reacting to comment: ${props.comment.id}`);
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
