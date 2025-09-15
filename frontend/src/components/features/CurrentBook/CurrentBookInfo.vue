<template>
    <BaseCard shadowColor="blue" size="medium">
        <BookInfo :book="book" />
    </BaseCard>
</template>

<script setup lang="ts">
import type { Book } from "@/types";
import BookInfo from "@/components/features/common/BookInfo.vue";

defineProps<{
    book: Book | null;
}>();
</script>

<style scoped></style>
