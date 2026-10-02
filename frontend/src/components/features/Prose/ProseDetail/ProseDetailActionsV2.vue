<template>
    <div class="detail-actions">
        <div class="engagement-summary">
            <ProseListItemStats
                :entry="entry"
                :showReadingTime="false"
                tapToOpenOnMobile
            >
                <template #empty>
                    <span class="empty-copy">
                        no reactions yet. be the first.
                    </span>
                </template>
            </ProseListItemStats>
        </div>

        <div v-if="!isGuestUser()" class="action-bar">
            <ReactionMenu
                v-if="!isAuthor"
                :item="entry"
                @select="emit('react', $event)"
            >
                <template
                    #trigger="{
                        props: activatorProps,
                        userHasReacted,
                        myReactions,
                    }"
                >
                    <ProseActionButton
                        v-bind="activatorProps"
                        color="blue"
                        :active="userHasReacted"
                        :label="userHasReacted ? 'reacted' : 'react'"
                        title="react to this piece"
                    >
                        <template #icon>
                            {{ userHasReacted ? myReactions[0].emoji : "🙂" }}
                        </template>
                    </ProseActionButton>
                </template>
            </ReactionMenu>

            <ProseActionButton
                v-if="!isAuthor"
                color="pink"
                :active="isFavorited"
                :disabled="savingFavorite"
                :label="isFavorited ? 'in your annals' : 'add to annals'"
                shortLabel="annals"
                :title="
                    isFavorited
                        ? 'remove this prose from your annals'
                        : 'add this prose to your annals'
                "
                @click="emit('toggle-favorite')"
            >
                <template #icon>
                    <FontAwesomeIcon
                        :icon="isFavorited ? faHeartSolid : faHeartRegular"
                    />
                </template>
            </ProseActionButton>

            <ProseActionButton
                color="lavender"
                label="cheeky feedback"
                shortLabel="feedback"
                title="add a cheeky comment, don't hold back"
                @click="emit('feedback')"
            >
                <template #icon>
                    <FontAwesomeIcon :icon="faCommentMedical" />
                </template>
            </ProseActionButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import ReactionMenu from "@/components/features/Palaver/PalaverListItem/ReactionMenu.vue";
import ProseListItemStats from "@/components/features/Prose/ProseListItemStats.vue";
import ProseActionButton from "./ProseActionButton.vue";
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
.detail-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.9rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.engagement-summary {
    min-width: 0;
    cursor: default;
}

.empty-copy {
    font-style: italic;
}

.action-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .detail-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.65rem;
        padding-top: 0.7rem;
    }

    .action-bar {
        gap: 0.4rem;
    }

    .action-bar > * {
        flex: 1 1 0;
        min-width: 0;
    }
}
</style>
