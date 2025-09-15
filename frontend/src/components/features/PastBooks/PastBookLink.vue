<template>
    <BaseCard
        shadowColor="fuschia"
        size="medium"
        hoverable
        @click="handleClick"
    >
        <BookInfo :book="book" :isLink="true" />
    </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BookInfo from "@/components/features/common/BookInfo.vue";
import type { Book } from "@/types";
import router from "@/router";

const props = defineProps<{
    book: Book;
}>();

const handleClick = () => {
    router.push(`/past/${props.book.id}`);
};
</script>
