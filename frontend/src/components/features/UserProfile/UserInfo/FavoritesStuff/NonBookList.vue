<template>
    <div class="non-book-list">
        <NonBookListColumn
            v-for="(column, index) in columns"
            :key="index"
            :items="column"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NonBookListColumn from "./NonBookListColumn.vue";

const props = defineProps<{
    items: string[];
}>();

const columns = computed(() => {
    const itemsPerColumn = 3;
    const cols: string[][] = [];

    for (let i = 0; i < props.items.length; i += itemsPerColumn) {
        cols.push(props.items.slice(i, i + itemsPerColumn));
    }

    return cols;
});
</script>

<style scoped>
.non-book-list {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .non-book-list {
        gap: 1rem;
    }
}
</style>
