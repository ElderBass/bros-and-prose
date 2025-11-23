<template>
    <div class="list">
        <ListFilters />
        <div v-if="!entries.length" class="empty">
            <p class="italics">you filtered that shit into oblivion</p>
        </div>
        <PalaverListItem v-else v-for="e in entries" :key="e.id" :entry="e" />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePalaverStore } from "@/stores/palaver";
import PalaverListItem from "@/components/features/Palaver/PalaverListItem/index.vue";
import ListFilters from "./ListFilters.vue";

const { filtered: entries } = storeToRefs(usePalaverStore());
</script>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}
.empty {
    text-align: center;
    margin-top: 2rem;
    padding: 2rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
}
.italics {
    font-style: italic;
    font-size: 1.25rem;
}
</style>
