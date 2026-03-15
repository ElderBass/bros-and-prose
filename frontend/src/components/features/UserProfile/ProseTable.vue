<template>
    <div class="prose-table">
        <div class="header" role="row">
            <div class="cell title">title</div>
            <div class="cell date">date</div>
            <div class="cell type">type</div>
            <div class="cell reactions">reactions</div>
        </div>

        <div class="rows">
            <ProseTableRow
                v-for="entry in entries"
                :key="entry.id"
                :entry="entry"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProseEntry } from "@/types";
import ProseTableRow from "./ProseTableRow.vue";

defineProps<{
    entries: ProseEntry[];
}>();
</script>

<style scoped>
.prose-table {
    width: 100%;
    border: 1px solid var(--accent-green);
    border-radius: 1rem;
    background-color: color-mix(in srgb, var(--accent-green) 4%, transparent);
    overflow: hidden;
}

.header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: 2fr 0.9fr 0.8fr 1.2fr;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-fuschia) 62%, rgba(0, 0, 0, 0.6)),
        color-mix(in srgb, var(--accent-lavender) 34%, rgba(0, 0, 0, 0.5))
    );
    border-bottom: 1px solid var(--accent-green);
    font-size: 0.85rem;
    text-transform: lowercase;
    letter-spacing: 0.02em;
    color: var(--accent-green);
    opacity: 1;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
}

.cell {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: inherit;
}

.rows {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
}

@media (max-width: 768px) {
    .header {
        display: none;
    }

    .rows {
        max-height: 360px;
    }
}

@media (min-width: 768px) {
    .rows {
        max-height: 540px;
    }
}
</style>
