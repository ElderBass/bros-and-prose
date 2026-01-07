<template>
    <div class="book-list-column">
        <BookListItem
            v-for="book in books"
            :key="book.id"
            :book="book"
            @click="handleClick(book)"
        />
    </div>
</template>

<script setup lang="ts">
import BookListItem from "./BookListItem.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    books: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "click", book: BookshelfBook): void;
}>();

const handleClick = (book: BookshelfBook) => {
    emit("click", book);
};
</script>

<style scoped>
.book-list-column {
    flex: 1 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
