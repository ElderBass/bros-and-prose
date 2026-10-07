<template>
    <div class="future-books-list">
        <FutureBookItem
            v-for="book in futureBooks"
            :key="book.id"
            :book="book"
            :isMostVoted="book.id === mostVotedFutureBookId"
        />
    </div>
</template>

<script setup lang="ts">
import FutureBookItem from "./FutureBookItem.vue";
import type { FutureBook } from "@/types";
import { storeToRefs } from "pinia";
import { useFutureBooksStore } from "@/stores/futureBooks";

defineProps<{
    futureBooks: FutureBook[];
}>();

const { mostVotedFutureBookId } = storeToRefs(useFutureBooksStore());
</script>

<style scoped>
.future-books-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    gap: 1.5rem;
    width: 100%;
}

.future-books-list > :deep(*) {
    flex: 1 1 320px;
    max-width: 420px;
    min-width: 0;
}

@media (max-width: 768px) {
    .future-books-list {
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 1rem;
    }
    .future-books-list > :deep(*) {
        flex: 0 0 auto;
        max-width: 100%;
        width: 100%;
    }
}
</style>
