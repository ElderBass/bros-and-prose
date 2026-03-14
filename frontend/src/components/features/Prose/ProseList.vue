<template>
    <div class="prose-list-wrap">
        <ProseTypeFilters />

        <div v-if="!entries.length" class="empty-state">
            <p class="empty-title">no prose matches this filter yet</p>
            <p class="empty-subtitle">
                try another type or be the first to publish one.
            </p>
        </div>

        <div v-else class="prose-list">
            <ProseListItem
                v-for="entry in entries"
                :key="entry.id"
                :entry="entry"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import ProseTypeFilters from "./ProseTypeFilters.vue";
import ProseListItem from "./ProseListItem.vue";
import { useProseStore } from "@/stores/prose";

const { filteredEntries: entries } = storeToRefs(useProseStore());
</script>

<style scoped>
.prose-list-wrap {
    width: 100%;
    max-width: 920px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.prose-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.empty-state {
    margin-top: 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: rgba(0, 191, 255, 0.06);
    padding: 1rem;
    text-align: center;
}

.empty-title {
    color: var(--accent-blue);
    font-size: 1.15rem;
    margin: 0;
}

.empty-subtitle {
    color: var(--main-text);
    opacity: 0.82;
    margin: 0.35rem 0 0;
}
</style>
