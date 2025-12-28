<template>
    <BookshelfListItem
        :book="book"
        shelf="wantToRead"
        :isLoggedInUser="isLoggedInUser"
    />
</template>

<script setup lang="ts">
import type { BookshelfBook } from "@/types";
import BookshelfListItem from "@/components/features/UserProfile/Shelves/BookshelfListItem.vue";

defineProps<{
    book: BookshelfBook;
    isLoggedInUser: boolean;
}>();
</script>
