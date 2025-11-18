<template>
    <div class="filters">
        <FilterButton
            v-for="filter in filters"
            :key="filter.value"
            :filter-value="filter.value as PalaverFilter"
            :filter-label="filter.label"
        />
    </div>
</template>

<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import type { PalaverFilter } from "@/stores/palaver";

const filters = [
    {
        label: "all",
        value: "all",
    },
    {
        label: "discussion",
        value: "discussion_note",
    },
    {
        label: "book rec",
        value: "recommendation",
    },
    {
        label: "supdate",
        value: "progress_note",
    },
    {
        label: "misc",
        value: "misc",
    },
];
defineProps<{
    filter: PalaverFilter;
}>();
</script>

<style scoped>
.filters {
    display: flex;
    gap: 0.5rem;
    max-width: 60%;
}
@media (max-width: 768px) {
    .filters {
        max-width: 100%;
    }
}
</style>
