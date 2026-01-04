<template>
    <div class="book-list">
        <BookListItem v-for="item in items" :key="item" :item="item" />
    </div>
</template>

<script setup lang="ts">
import BookListItem from "./BookListItem.vue";

defineProps<{
    items: string[];
}>();
</script>

<style scoped>
.book-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}
</style>
