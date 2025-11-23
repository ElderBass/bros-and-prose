<template>
    <div class="list-item-like-actions">
        <ReactionButton
            v-for="reaction in REACTION_TYPES"
            :key="reaction"
            :type="reaction"
            :reactions="getReactions(reaction)"
            :onClick="() => handleReaction(reaction)"
        />
    </div>
</template>

<script setup lang="ts">
import ReactionButton from "./ReactionButton.vue";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import {
    REACTION_TYPES,
    LIKED_PALAVER_ENTRY_SUCCESS_ALERT,
    DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT,
} from "@/constants";
import type { PalaverEntry, ReactionType } from "@/types";

const { likePalaverEntry, dislikePalaverEntry } = usePalaver();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const props = defineProps<{ entry: PalaverEntry }>();

const handleReaction = async (reaction: ReactionType) => {
    if (reaction === "like") {
        await handleLike();
    } else {
        await handleDislike();
    }
};

const handleLike = async () => {
    try {
        await likePalaverEntry(props.entry);
        await logInfo(`Liked palaver entry: ${props.entry.id}`);
        showAlert(LIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error liking palaver entry: ${props.entry.id}`);
    }
};

const handleDislike = async () => {
    try {
        await dislikePalaverEntry(props.entry);
        await logInfo(`Disliked palaver entry: ${props.entry.id}`);
        showAlert(DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error disliking palaver entry: ${props.entry.id}`);
    }
};

const getReactions = (reaction: ReactionType): string[] => {
    return reaction === "like"
        ? props.entry.likes || []
        : props.entry.dislikes || [];
};
</script>

<style scoped>
.list-item-like-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-right: 0.5rem;
}

@media (max-width: 768px) {
    .list-item-like-actions {
        gap: 0.5rem;
        padding-right: 0.25rem;
    }
}
</style>
