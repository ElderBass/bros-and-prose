<template>
    <RouterLink
        class="router-link-wrapper past-book-link"
        :to="`/past/${props.book.id}`"
    >
        <BaseCard
            shadowColor="fuschia"
            size="small"
            hoverable
            style="max-height: 180px; height: 160px"
        >
            <BookInfo :book="book" :isLink="true" />
        </BaseCard>
    </RouterLink>
</template>

<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BookInfo from "@/components/features/common/BookInfo.vue";
import type { Book } from "@/types";

const props = defineProps<{
    book: Book;
}>();
</script>

<style scoped>
.past-book-link {
    width: 320px;
}
</style>
