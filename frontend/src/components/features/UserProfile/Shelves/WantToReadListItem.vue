<template>
    <div class="want-to-read-list-item">
        <div class="want-to-read-list-item-title">
            {{ book.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from "@/types";

defineProps<{
    book: Book;
}>();
</script>

<style scoped>
.want-to-read-list-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
