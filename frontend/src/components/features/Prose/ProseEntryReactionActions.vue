<template>
    <div class="reaction-actions">
        <ReactionButton
            v-for="reaction in REACTION_TYPES"
            :key="reaction"
            :type="reaction"
            :reactions="getReactionArray(reaction)"
            :onClick="() => handleReaction(reaction)"
            size="small"
        />
    </div>
</template>

<script setup lang="ts">
import ReactionButton from "@/components/features/Palaver/PalaverListItem/ReactionButton.vue";
import { useProse } from "@/composables/useProse";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import {
    REACTION_TYPES,
    LIKED_PALAVER_ENTRY_SUCCESS_ALERT,
    DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT,
} from "@/constants";
import type { ProseEntry, ReactionType } from "@/types";

const props = defineProps<{
    entry: ProseEntry;
}>();

const emit = defineEmits<{
    (e: "entry-updated", entry: ProseEntry): void;
}>();

const { likeProseEntry, dislikeProseEntry } = useProse();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const getReactionArray = (reaction: ReactionType) => {
    return reaction === "like"
        ? props.entry.likes || []
        : props.entry.dislikes || [];
};

const handleReaction = async (reaction: ReactionType) => {
    if (reaction === "like") {
        await handleLike();
    } else {
        await handleDislike();
    }
};

const handleLike = async () => {
    try {
        const updated = await likeProseEntry(props.entry);
        if (updated) emit("entry-updated", updated);
        await logInfo(`Liked prose entry: ${props.entry.id}`);
        showAlert(LIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error liking prose entry: ${props.entry.id}`);
    }
};

const handleDislike = async () => {
    try {
        const updated = await dislikeProseEntry(props.entry);
        if (updated) emit("entry-updated", updated);
        await logInfo(`Disliked prose entry: ${props.entry.id}`);
        showAlert(DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error disliking prose entry: ${props.entry.id}`);
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
