<template>
    <div class="reaction-actions">
        <ReactionButton
            v-for="reaction in REACTION_TYPES"
            :key="reaction"
            :type="reaction"
            :reactions="getReactions(reaction, props.entry)"
            :onClick="() => handleReaction(reaction)"
        />
        <CommentButton :entry="entry" />
    </div>
</template>

<script setup lang="ts">
import ReactionButton from "./ReactionButton.vue";
import CommentButton from "./CommentButton.vue";
import { usePalaver } from "@/composables/usePalaver";
import { useLog } from "@/composables/useLog";
import { useUIStore } from "@/stores/ui";
import {
    REACTION_TYPES,
    LIKED_PALAVER_ENTRY_SUCCESS_ALERT,
    DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT,
} from "@/constants";
import type { PalaverEntry, ReactionType } from "@/types";
import { getReactions } from "@/utils";

const { likePalaverEntry, dislikePalaverEntry } = usePalaver();
const { showAlert } = useUIStore();
const { info: logInfo, error: logError } = useLog();

const props = defineProps<{ entry: PalaverEntry }>();

const emit = defineEmits<{
    (e: "entry-updated", entry: PalaverEntry): void;
}>();

const handleReaction = async (reaction: ReactionType) => {
    if (reaction === "like") {
        await handleLike();
    } else {
        await handleDislike();
    }
};

const handleLike = async () => {
    try {
        const updated = await likePalaverEntry(props.entry);
        if (updated) emit("entry-updated", updated);
        await logInfo(`Liked palaver entry: ${props.entry.id}`);
        showAlert(LIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error liking palaver entry: ${props.entry.id}`);
    }
};

const handleDislike = async () => {
    try {
        const updated = await dislikePalaverEntry(props.entry);
        if (updated) emit("entry-updated", updated);
        await logInfo(`Disliked palaver entry: ${props.entry.id}`);
        showAlert(DISLIKED_PALAVER_ENTRY_SUCCESS_ALERT);
    } catch (error) {
        console.error(error);
        await logError(`Error disliking palaver entry: ${props.entry.id}`);
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
