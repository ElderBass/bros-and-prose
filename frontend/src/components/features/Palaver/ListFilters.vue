<template>
    <div class="filters-container">
        <div class="filter-side filter-side-left">
            <FontAwesomeIcon :icon="faSliders" class="sliders-icon" />
        </div>
        <div class="filter-scroll" aria-label="Palaver filters">
            <div class="filter-buttons">
                <FilterButton
                    v-for="filter in filters"
                    :key="filter.value"
                    :filter-value="filter.value as PalaverFilter"
                    :filter-label="filter.label"
                />
                <BroFilterSelect />
            </div>
        </div>
        <div class="filter-side filter-side-right">
            <ClearFiltersButton />
        </div>
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
        label: "prompts",
        value: "prose_prompt",
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
    width: min(760px, 70vw);
    min-width: 0;
}

.filter-side {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-scroll {
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}

.filter-buttons {
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 0.5rem;
    padding: 0.5rem 0.25rem;
}

.sliders-icon {
    color: var(--accent-blue);
    font-size: 1.75rem;
}

@media (max-width: 768px) {
    .filters-container {
        width: 100%;
        gap: 0.25rem;
    }
    .sliders-icon {
        font-size: 1.25rem;
    }
    .filter-side {
        min-width: 2rem;
    }
    .filter-buttons {
        gap: 0.25rem;
        padding: 0.25rem 0.125rem;
    }
}
</style>
