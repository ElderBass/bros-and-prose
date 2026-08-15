<template>
    <div class="reaction-actions">
        <ReactionMenu :item="entry" size="small" @select="handleReaction" />
    </div>
</template>

<script setup lang="ts">
import ReactionMenu from "@/components/features/Palaver/PalaverListItem/ReactionMenu.vue";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import { QUICK_SUCCESS } from "@/constants";
import type { EmojiReactionKey, ProseEntry } from "@/types";
import { getEmojiReactionOption } from "@/utils";

const props = defineProps<{
    entry: ProseEntry;
}>();

const emit = defineEmits<{
    (e: "entry-updated", entry: ProseEntry): void;
}>();

const { toggleProseEntryReaction } = useProse();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const handleReaction = async (reactionKey: EmojiReactionKey) => {
    try {
        const updated = await toggleProseEntryReaction(
            props.entry,
            reactionKey
        );
        if (updated) emit("entry-updated", updated);
        const reaction = getEmojiReactionOption(reactionKey);
        await logInfo(`Reacted to prose entry: ${props.entry.id}`);
        showAlert(
            QUICK_SUCCESS([
                "reaction updated successfully.",
                `${reaction?.emoji || ""} ${reaction?.label || "reaction"}`,
            ])
        );
    } catch (error) {
        console.error(error);
        await logError(`Error reacting to prose entry: ${props.entry.id}`);
    }
};
</script>

<style scoped>
.reaction-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.65rem;
    padding: 0.5rem 0;
}
</style>
