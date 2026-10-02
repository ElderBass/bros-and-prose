<template>
    <article class="engagement-hover-card" @click.stop>
        <div class="card-header">
            <p class="eyebrow">the peanut gallery</p>
            <h3 class="piece-title">{{ entry.title }}</h3>
        </div>

        <section class="engagement-section section-reactions">
            <p class="section-title">reactions</p>
            <template v-if="reactionRows.length">
                <div
                    v-for="row in reactionRows"
                    :key="row.key"
                    class="engagement-row"
                >
                    <span class="row-emoji" aria-hidden="true">
                        {{ row.emoji }}
                    </span>
                    <NameList :names="row.names" />
                </div>
            </template>
            <p v-else class="fallback">no reactions yet. tough crowd.</p>
        </section>

        <section class="engagement-section section-comments">
            <p class="section-title">comments</p>
            <div v-if="commenters.length" class="engagement-row">
                <NameList :names="commenters" />
            </div>
            <p v-else class="fallback">
                no comments yet. speechless, apparently.
            </p>
        </section>

        <section class="engagement-section section-favorites">
            <p class="section-title">favorites</p>
            <div v-if="favoriters.length" class="engagement-row">
                <NameList :names="favoriters" />
            </div>
            <p v-else class="fallback">
                nobody's added this to their annals yet.
            </p>
        </section>
    </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NameList from "./ProseEngagementNameList.vue";
import type { ProseEntry } from "@/types";
import { getVisibleReactionBuckets } from "@/utils";
import { uniqueCommenterUsernames } from "@/utils/reactionDisplayUtils";

const props = defineProps<{
    entry: ProseEntry;
}>();

const reactionRows = computed(() =>
    [...getVisibleReactionBuckets(props.entry)]
        .sort((a, b) => b.reactors.length - a.reactors.length)
        .map((bucket) => ({
            key: bucket.key,
            emoji: bucket.emoji,
            names: bucket.reactors,
        }))
);

const commenters = computed(() =>
    uniqueCommenterUsernames(props.entry.comments)
);

const favoriters = computed(() => props.entry.favorites ?? []);
</script>

<style scoped>
.engagement-hover-card {
    width: min(88vw, 20rem);
    padding: 0.85rem;
    background:
        linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent-blue) 10%, transparent),
            transparent 45%
        ),
        var(--surface-color);
    border: 1px solid
        color-mix(in srgb, var(--accent-lavender) 45%, transparent);
    border-radius: 0.85rem;
    box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.38),
        0 0 0 1px rgba(255, 255, 255, 0.04);
    color: var(--main-text);
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.card-header {
    padding-bottom: 0.65rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.eyebrow {
    margin: 0;
    color: var(--accent-lavender);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.2;
    text-transform: lowercase;
}

.piece-title {
    margin: 0.15rem 0 0;
    color: var(--accent-blue);
    font-size: 1.05rem;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.engagement-section {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.section-title {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.section-reactions .section-title {
    color: var(--accent-lavender);
}

.section-comments .section-title {
    color: var(--accent-blue);
}

.section-favorites .section-title {
    color: var(--accent-pink);
}

.engagement-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.9rem;
    line-height: 1.4;
}

.row-emoji {
    flex-shrink: 0;
    width: 1.25rem;
    text-align: center;
}

.fallback {
    margin: 0;
    font-size: 0.85rem;
    font-style: italic;
    opacity: 0.65;
}
</style>
