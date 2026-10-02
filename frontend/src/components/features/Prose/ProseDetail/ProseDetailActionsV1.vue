<template>
    <div class="actions-row">
        <ProseReactionPills
            :entry="entry"
            :clickable="!isGuestUser()"
            @select="emit('react', $event)"
        />
        <ProseEntryReactionActions
            v-if="!isGuestUser() && !isAuthor"
            :entry="entry"
            @entry-updated="emit('entry-updated', $event)"
        />
        <div v-if="!isGuestUser()" class="entry-actions">
            <IconButton
                v-if="!isAuthor"
                :icon="isFavorited ? faHeartSolid : faHeartRegular"
                color="pink"
                size="small"
                :title="
                    isFavorited
                        ? 'remove this prose from your annals'
                        : 'add this prose to your annals'
                "
                :disabled="savingFavorite"
                :handleClick="() => emit('toggle-favorite')"
            />
            <BaseButton
                variant="outline"
                size="small"
                title="add a cheeky comment, don't hold back"
                :showTooltip="false"
                class="comment-btn"
                @click="emit('feedback')"
            >
                <FontAwesomeIcon :icon="faCommentMedical" />
                <span class="comment-btn-text">cheeky feedback</span>
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProseEntryReactionActions from "@/components/features/Prose/ProseEntryReactionActions.vue";
import ProseReactionPills from "@/components/features/Prose/ProseReactionPills.vue";
import IconButton from "@/components/ui/IconButton.vue";
import type { EmojiReactionKey, ProseEntry } from "@/types";
import { isGuestUser } from "@/utils";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

defineProps<{
    entry: ProseEntry;
    isAuthor: boolean;
    isFavorited: boolean;
    savingFavorite: boolean;
}>();

const emit = defineEmits<{
    (e: "react", reactionKey: EmojiReactionKey): void;
    (e: "toggle-favorite"): void;
    (e: "feedback"): void;
    (e: "entry-updated", entry: ProseEntry): void;
}>();
</script>

<style scoped>
.actions-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.entry-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.comment-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

@media (max-width: 768px) {
    .actions-row {
        gap: 0.75rem;
        flex-wrap: nowrap;
    }

    .entry-actions {
        gap: 0.35rem;
    }

    .comment-btn-text {
        display: none;
    }

    .comment-btn {
        min-width: auto;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }
}
</style>
