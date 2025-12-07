<template>
    <div class="have-read-list-item">
        <div class="have-read-list-item-title">
            {{ book.title }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";

defineProps<{
    book: FutureBook;
}>();
</script>

<style scoped>
.have-read-list-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
