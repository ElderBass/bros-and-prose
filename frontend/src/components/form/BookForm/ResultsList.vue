<template>
    <div class="results">
        <p v-if="title" class="results-title">{{ title }}</p>

        <BookSearchResultRow
            v-for="(result, index) in results"
            :key="resultKey(result, index)"
            :result="result"
            :selected="
                Boolean(selectedResultId && result.id === selectedResultId)
            "
            @select="emit('select', result)"
        />
    </div>
</template>

<script setup lang="ts">
import BookSearchResultRow from "./BookSearchResultRow.vue";
import type { BookFormSearchResult } from "./types";

const props = withDefaults(
    defineProps<{
        results: BookFormSearchResult[];
        selectedResultId: string | null;
        title?: string;
        keyFn?: (result: BookFormSearchResult, index: number) => string;
    }>(),
    {
        selectedResultId: null,
        title: "pick the right prose for ya, bro:",
        keyFn: undefined,
    }
);

const emit = defineEmits<{
    (e: "select", result: BookFormSearchResult): void;
}>();

const resultKey = (result: BookFormSearchResult, index: number) => {
    if (props.keyFn) return props.keyFn(result, index);
    return `${result.id || ""}-${result.title || ""}-${result.author || ""}-${index}`;
};
</script>

<style scoped>
.results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.results-title {
    margin: 0;
    padding-left: 0.5rem;
    color: var(--main-text);
    opacity: 0.85;
    font-style: italic;
}
</style>
