<template>
    <div class="current-book-container">
        <h1>current prose ferda bros</h1>
        <CurrentBookInfo :book="currentBook" />
        <CurrentBookUserSection :totalPages="currentBook?.totalPages ?? 0" />
    </div>
</template>

<script setup lang="ts">
import CurrentBookInfo from "./CurrentBookInfo.vue";
import CurrentBookUserSection from "./CurrentBookUserSection.vue";
import { useBooksStore } from "@/stores/books";

const { currentBook } = useBooksStore();
</script>

<style scoped>
.current-book-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 3rem;
}
h1 {
    font-size: 1.55rem;
    color: var(--main-text);
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 0.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
    h1 {
        font-size: 2rem;
    }
}
</style>
