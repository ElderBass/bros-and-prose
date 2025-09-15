<template>
    <div class="past-book-list">
        <PastBookLink v-for="book in pastBooks" :key="book.id" :book="book" />
    </div>
</template>

<script setup lang="ts">
import PastBookLink from "./PastBookLink.vue";
import { useBooksStore } from "@/stores/books";

const { pastBooks } = useBooksStore();
</script>

<style scoped>
.past-book-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    padding-top: 2rem;
}

@media (min-width: 768px) {
    .past-book-list {
        width: 60%;
    }
}
</style>
