<template>
    <div class="future-book-item">
        <img :src="book.imageSrc" :alt="book.title" />
        <h3>{{ book.title }}</h3>
        <p>{{ book.author }}</p>
        <p>{{ book.yearPublished }}</p>
        <p>{{ book.votes }}</p>
        <p>{{ book.description }}</p>
    </div>
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";

defineProps<{
    book: FutureBook;
}>();
</script>

<style scoped>
.future-book-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
