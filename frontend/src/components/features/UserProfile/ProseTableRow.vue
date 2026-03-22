<template>
    <RouterLink :to="`/prose/${entry.id}`" class="row">
        <div class="cell title">
            <span class="title-text">{{ entry.title }}</span>
        </div>
        <div class="cell date">{{ createdAtLabel }}</div>
        <div class="cell type">
            <ProseTypePill :type="entry.type" />
        </div>
        <div class="cell reactions" @click.stop>
            <ReactionPill
                type="like"
                :count="entry.likes?.length ?? 0"
                :reactors="entry.likes"
            />
            <ReactionPill
                type="dislike"
                :count="entry.dislikes?.length ?? 0"
                :reactors="entry.dislikes"
            />
            <ReactionPill
                type="comment"
                :count="entry.comments?.length ?? 0"
                :reactors="commentUsernames"
            />
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { ProseEntry } from "@/types";
import ProseTypePill from "@/components/features/Prose/ProseTypePill.vue";
import ReactionPill from "@/components/features/common/ReactionPill.vue";
import { uniqueCommenterUsernames } from "@/utils/reactionDisplayUtils";

const props = defineProps<{
    entry: ProseEntry;
}>();

const commentUsernames = computed(() =>
    uniqueCommenterUsernames(props.entry.comments)
);

const createdAtLabel = computed(() => {
    const date = new Date(props.entry.createdAt);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
    });
});
</script>

<style scoped>
.row {
    display: grid;
    grid-template-columns: 2fr 0.9fr 0.8fr 1.2fr;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid
        color-mix(in srgb, var(--accent-green) 35%, transparent);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    text-decoration: none;
    color: inherit;
}

.row:hover {
    background-color: color-mix(in srgb, var(--accent-green) 10%, transparent);
}

.row:focus-visible {
    outline: 2px solid var(--accent-green);
    outline-offset: -2px;
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
}

.title-text {
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
    font-weight: 600;
}

.cell.date {
    color: var(--accent-green);
    font-size: 0.85rem;
}

.cell.reactions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
}

/* Mobile: title row, then date + type row, then reactions row */
@media (max-width: 768px) {
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.75rem;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .cell {
        font-size: 0.95rem;
        white-space: normal;
    }

    /* Row 1: title only */
    .cell.title {
        flex: 1 1 100%;
        min-width: 0;
        order: 1;
    }

    /* Row 2: date and type */
    .cell.date {
        flex: 0 0 auto;
        order: 2;
        font-size: 0.85rem;
        opacity: 0.9;
    }

    .cell.type {
        flex: 0 0 auto;
        order: 3;
    }

    /* Row 3: reactions */
    .cell.reactions {
        flex: 1 1 100%;
        order: 4;
    }
}
</style>
