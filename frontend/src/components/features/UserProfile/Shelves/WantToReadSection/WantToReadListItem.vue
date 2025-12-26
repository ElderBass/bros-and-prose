<template>
    <BookshelfListItem
        :book="book"
        shelf="wantToRead"
        :showActions="showActions"
    />
</template>

<script setup lang="ts">
import type { BookshelfBook } from "@/types";
import BookshelfListItem from "@/components/features/UserProfile/Shelves/BookshelfListItem.vue";

defineProps<{
    book: BookshelfBook;
    showActions: boolean;
}>();
</script>

<style scoped></style>
