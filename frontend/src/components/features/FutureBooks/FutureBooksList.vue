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
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
}

.future-books-list > :deep(*) {
    flex: 0 0 calc((100% - 3rem) / 3);
    min-width: 0;
}

@media (max-width: 1024px) {
    .future-books-list > :deep(*) {
        flex: 0 0 calc(50% - 0.75rem);
    }
}

@media (max-width: 768px) {
    .future-books-list > :deep(*) {
        flex: 0 0 100%;
    }
}
</style>
