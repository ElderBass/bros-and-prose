<!-- src/components/features/Palaver/PalaverList.vue -->
<template>
    <div class="list">
        <div v-if="!entries.length" class="empty">
            <p class="italics">
                no hot takes yet — be the hero we don’t deserve
            </p>
        </div>
        <PalaverListItem v-for="e in entries" :key="e.id" :entry="e" />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { usePalaverStore } from "@/stores/palaver";
import PalaverListItem from "./PalaverListItem.vue";

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
