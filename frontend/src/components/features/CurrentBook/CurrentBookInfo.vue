<template>
    <BaseCard shadowColor="blue" size="medium">
        <BookInfo :book="book" />
    </BaseCard>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import BookInfo from "@/components/features/common/BookInfo/index.vue";

defineProps<{
    book: Book;
}>();
</script>

<style scoped></style>
