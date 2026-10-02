<template>
    <v-menu
        :disabled="mobile && !tapToOpenOnMobile"
        :open-on-hover="!mobile"
        :open-on-click="mobile"
        :close-on-content-click="true"
        location="bottom"
        :offset="8"
        content-class="prose-engagement-menu-overlay"
        transition="scale-transition"
    >
        <template #activator="{ props: menuActivatorProps }">
            <ul
                v-bind="menuActivatorProps"
                class="prose-stats"
                :class="{ compact }"
            >
                <li v-if="reactionTotal > 0" class="stat">
                    <span class="emoji-stack" aria-hidden="true">
                        <span
                            v-for="reaction in topReactions"
                            :key="reaction.key"
                            class="emoji-icon"
                        >
                            {{ reaction.emoji }}
                        </span>
                    </span>
                    <span>{{ reactionTotal }}</span>
                </li>
                <li v-if="commentCount > 0" class="stat stat-comment">
                    <FontAwesomeIcon :icon="faComment" class="stat-icon" />
                    <span>{{ commentCount }}</span>
                </li>
                <li v-if="favoriteCount > 0" class="stat">
                    <FontAwesomeIcon :icon="faHeart" class="stat-icon" />
                    <span>{{ favoriteCount }}</span>
                </li>
                <li v-if="showReadingTime && readingMinutes > 0" class="stat">
                    {{ readingMinutes }} min read
                </li>
                <li v-if="!hasEngagement && $slots.empty" class="stat">
                    <slot name="empty" />
                </li>
            </ul>
        </template>
        <ProseEngagementHoverCard :entry="entry" />
    </v-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import ProseEngagementHoverCard from "./ProseEngagementHoverCard.vue";
import type { ProseEntry } from "@/types";
import { getReadingTimeMinutes, getVisibleReactionBuckets } from "@/utils";

const MAX_STACKED_EMOJIS = 3;

const props = withDefaults(
    defineProps<{
        entry: ProseEntry;
        compact?: boolean;
        showReadingTime?: boolean;
        /** Open the engagement card on tap when hover isn't available. */
        tapToOpenOnMobile?: boolean;
    }>(),
    {
        compact: false,
        showReadingTime: true,
        tapToOpenOnMobile: false,
    }
);

const { mobile } = useDisplay();

const reactionBuckets = computed(() =>
    [...getVisibleReactionBuckets(props.entry)].sort(
        (a, b) => b.reactors.length - a.reactors.length
    )
);

const topReactions = computed(() =>
    reactionBuckets.value.slice(0, MAX_STACKED_EMOJIS)
);

const reactionTotal = computed(() =>
    reactionBuckets.value.reduce((sum, r) => sum + r.reactors.length, 0)
);

const commentCount = computed(() => props.entry.comments?.length ?? 0);
const favoriteCount = computed(() => props.entry.favorites?.length ?? 0);
const hasEngagement = computed(
    () =>
        reactionTotal.value > 0 ||
        commentCount.value > 0 ||
        favoriteCount.value > 0
);
const readingMinutes = computed(() =>
    getReadingTimeMinutes(props.entry.markdown || "")
);
</script>

<style scoped>
.prose-stats {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    row-gap: 0.25rem;
    font-size: 0.92rem;
    --stats-muted: color-mix(in srgb, var(--main-text) 72%, transparent);
    color: var(--stats-muted);
}

.stat {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
}

.stat + .stat::before {
    content: "·";
    margin: 0 0.55rem;
    color: var(--stats-muted);
    opacity: 0.7;
}

.stat-comment {
    color: var(--accent-blue);
}

.stat-icon {
    font-size: 0.8em;
}

.emoji-stack {
    display: inline-flex;
    align-items: center;
    opacity: 0.95;
}

.emoji-icon {
    display: inline-flex;
    font-size: 1.05em;
    line-height: 1;
}

.emoji-icon + .emoji-icon {
    margin-left: 0.1rem;
}

.prose-stats.compact {
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .prose-stats {
        font-size: 0.85rem;
    }

    .stat + .stat::before {
        margin: 0 0.4rem;
    }
}
</style>

<style>
.prose-engagement-menu-overlay {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}
</style>
