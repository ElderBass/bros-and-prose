<template>
    <EmojiReactionPills
        :item="comment"
        size="xsmall"
        :clickable="clickable"
        @select="handleReaction"
    />
</template>

<script setup lang="ts">
import EmojiReactionPills from "@/components/features/common/EmojiReactionPills.vue";
import type { Comment, EmojiReactionKey } from "@/types";
import { QUICK_SUCCESS } from "@/constants";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import { getEmojiReactionOption } from "@/utils";

const props = defineProps<{
    comment: Comment;
    entryId: string;
    clickable?: boolean;
}>();

const { togglePalaverCommentReaction } = usePalaver();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    if (!props.clickable) return;
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
