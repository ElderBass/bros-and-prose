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
import { getNonBookItemColumns } from "@/utils/userFavoritesUtils";

const props = defineProps<{
    items: string[];
}>();

const columns = computed(() => getNonBookItemColumns(props.items));
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
