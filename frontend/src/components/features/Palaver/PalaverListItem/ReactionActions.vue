<template>
    <div class="reaction-actions">
        <ReactionMenu :item="props.entry" @select="handleReaction" />
        <CommentButton :entry="entry" />
    </div>
</template>

<script setup lang="ts">
import ReactionMenu from "./ReactionMenu.vue";
import CommentButton from "./CommentButton.vue";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import { QUICK_SUCCESS } from "@/constants";
import type { EmojiReactionKey, PalaverEntry } from "@/types";
import { getEmojiReactionOption } from "@/utils";

const { togglePalaverEntryReaction } = usePalaver();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const props = defineProps<{ entry: PalaverEntry }>();

const emit = defineEmits<{
    (e: "entry-updated", entry: PalaverEntry): void;
}>();

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    try {
        const updated = await togglePalaverEntryReaction(
            props.entry,
            reactionKey
        );
        if (updated) emit("entry-updated", updated);
        const reaction = getEmojiReactionOption(reactionKey);
        await logInfo(`Reacted to palaver entry: ${props.entry.id}`);
        showAlert(
            QUICK_SUCCESS([
                "reaction updated successfully.",
                `${reaction?.emoji || ""} ${reaction?.label || "reaction"}`,
            ])
        );
    } catch (error) {
        console.error(error);
        await logError(`Error reacting to palaver entry: ${props.entry.id}`);
    }
};
</script>

<style scoped>
.reaction-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding-right: 0.75rem;
    margin-right: -0.5rem;
}

@media (max-width: 768px) {
    .reaction-actions {
        gap: 0.5rem;
        padding-right: 0.5rem;
    }
}
</style>
