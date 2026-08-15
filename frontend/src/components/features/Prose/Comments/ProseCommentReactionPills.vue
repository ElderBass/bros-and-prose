<template>
    <EmojiReactionPills
        :item="comment"
        size="xsmall"
        :clickable="clickable"
        :filterReactors="isNotCommentAuthor"
        @select="handleReaction"
    />
</template>

<script setup lang="ts">
import EmojiReactionPills from "@/components/features/common/EmojiReactionPills.vue";
import type { Comment, EmojiReactionKey, ProseEntry } from "@/types";
import { QUICK_SUCCESS } from "@/constants";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import { getEmojiReactionOption } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
    comment: Comment;
    clickable?: boolean;
}>();

const emit = defineEmits<{
    (e: "entry-updated", entry: ProseEntry): void;
}>();

const { toggleProseCommentReaction } = useProse();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const isNotCommentAuthor = (username: string) => {
    return username !== props.comment.userInfo.username;
};

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    if (!props.clickable) return;
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
