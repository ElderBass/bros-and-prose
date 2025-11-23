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

.button-wrapper {
    position: relative;
}

.count-badge {
    position: absolute;
    top: -0.7rem;
    right: -0.7rem;
    min-width: 1.05rem;
    height: 1.05rem;
    border-radius: 999px;
    border: 1px solid currentColor;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    padding: 0 0.25rem;
}

.count-badge--green {
    color: var(--accent-green);
}

.count-badge--red {
    color: var(--accent-red);
}

@media (max-width: 768px) {
    .list-item-like-actions {
        gap: 0.5rem;
        padding-right: 0.25rem;
    }
    .count-badge {
        top: -0.5rem;
        right: -0.5rem;
        min-width: 0.95rem;
        height: 0.95rem;
        font-size: 0.65rem;
        padding: 0 0.15rem;
    }
}
</style>
