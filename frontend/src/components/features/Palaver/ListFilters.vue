<template>
    <div class="filters-container">
        <FontAwesomeIcon :icon="faSliders" class="sliders-icon" />
        <div class="filter-buttons">
            <FilterButton
                v-for="filter in filters"
                :key="filter.value"
                :filter-value="filter.value as PalaverFilter"
                :filter-label="filter.label"
            />
            <BroFilterSelect />
        </div>
        <ClearFiltersButton />
    </div>
</template>

<script setup lang="ts">
import FilterButton from "./FilterButton.vue";
import ClearFiltersButton from "./ClearFiltersButton.vue";
import BroFilterSelect from "./BroFilterSelect.vue";
import type { PalaverFilter } from "@/stores/palaver";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

const filters = [
    {
        label: "comments",
        value: "discussion_note",
    },
    {
        label: "recs",
        value: "recommendation",
    },
    {
        label: "reviews",
        value: "review",
    },
    {
        label: "updates",
        value: "progress_note",
    },
    {
        label: "app ideas",
        value: "suggestion",
    },
    {
        label: "misc",
        value: "misc",
    },
];
</script>

<style scoped>
.filters-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 50%;
}
.filter-buttons {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
}

.sliders-icon {
    color: var(--accent-blue);
    font-size: 1.75rem;
}

@media (max-width: 768px) {
    .filters-container {
        width: 100%;
    }
    .sliders-icon {
        font-size: 1.25rem;
    }
    .filter-buttons {
        gap: 0.25rem;
        padding: 0.25rem;
    }
}
</style>
