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
    flex: 1 0 auto;
    height: 100%;
    min-height: 164px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .non-book-list-column {
        min-height: 100px;
    }
}
</style>
