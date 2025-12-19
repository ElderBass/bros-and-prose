<template>
    <BookshelfBookListItem
        :book="book"
        shelf="wantToRead"
        :showActions="showActions"
    />
</template>

<script setup lang="ts">
import type { BookshelfBook } from "@/types";
import BookshelfBookListItem from "@/components/features/UserProfile/Shelves/BookshelfBookListItem.vue";

defineProps<{
    book: BookshelfBook;
    showActions: boolean;
}>();
</script>

<style scoped></style>
