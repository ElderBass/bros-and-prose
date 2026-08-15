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
import type { Comment, EmojiReactionKey, ProseEntry } from "@/types";
import { QUICK_SUCCESS } from "@/constants";
import { getEmojiReactionOption } from "@/utils";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    comment: Comment;
    entry: ProseEntry;
}>();

const emit = defineEmits<{
    (e: "entry-updated", entry: ProseEntry): void;
}>();

const { toggleProseCommentReaction } = useProse();
const { error: logError, info: logInfo } = useLog();
const { showAlert } = useUIStore();

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    try {
        const updated = await toggleProseCommentReaction(
            props.entry,
            props.comment,
            reactionKey
        );
        if (updated) emit("entry-updated", updated);
        const reaction = getEmojiReactionOption(reactionKey);
        await logInfo(`Reacted to prose comment: ${props.comment.id}`);
        showAlert(
            QUICK_SUCCESS([
                "reaction updated successfully.",
                `${reaction?.emoji || ""} ${reaction?.label || "reaction"}`,
            ])
        );
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
