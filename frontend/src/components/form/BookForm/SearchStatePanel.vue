<template>
    <Transition name="fade-slide" mode="out-in">
        <SearchSkeletonLoader v-if="loading" />

        <div v-else-if="showResults" key="results">
            <ResultsList
                :results="results"
                :selectedResultId="selectedResultId"
                :title="title"
                @select="emit('select', $event)"
            />
        </div>

        <div v-else-if="showEmpty" class="empty-panel" key="empty">
            <p>enter a title and we'll divine some books</p>
            <span class="hash">#godsplan</span>
        </div>

        <div v-else key="none" />
    </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SearchSkeletonLoader from "./SearchSkeletonLoader.vue";
import ResultsList from "./ResultsList.vue";
import type { BookFormSearchResult } from "./types";

const props = withDefaults(
    defineProps<{
        loading: boolean;
        results: BookFormSearchResult[];
        selectedResultId: string | null;
        manualMode: boolean;
        title?: string;
    }>(),
    {
        manualMode: false,
        title: "pick the right prose for ya, bro:",
    }
);

const emit = defineEmits<{
    (e: "select", result: BookFormSearchResult): void;
}>();

const showResults = computed(() => {
    return props.results.length > 0 && !props.selectedResultId;
});

const showEmpty = computed(() => {
    // Show the empty panel only when we're not showing results and not in manual mode.
    return !showResults.value && !props.manualMode && !props.selectedResultId;
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.empty-panel-wrapper {
    height: 100%;
}

.empty-panel {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hash {
    color: var(--accent-fuschia);
}

@media (max-width: 768px) {
    .empty-panel {
        font-size: 1.125rem;
        padding: 1rem;
    }
}
</style>
