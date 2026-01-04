<template>
    <div class="non-book-list-column">
        <NonBookListItem v-for="item in items" :key="item" :item="item" />
    </div>
</template>

<script setup lang="ts">
import NonBookListItem from "./NonBookListItem.vue";

defineProps<{
    items: string[];
}>();
</script>

<style scoped>
.non-book-list-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 200px;
}

@media (max-width: 768px) {
    .non-book-list-column {
        min-width: 150px;
    }
}
</style>
