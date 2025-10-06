<template>
    <div class="future-books-list">
        <FutureBookItem
            v-for="book in futureBooks"
            :key="book.id"
            :book="book"
        />
    </div>
</template>

<script setup lang="ts">
import FutureBookItem from "./FutureBookItem.vue";
import { useBooksStore } from "@/stores/books";

const { futureBooks } = useBooksStore();
</script>
