<template>
    <RouterLink
        class="router-link-wrapper past-book-link"
        :to="`/past/${props.book.id}`"
    >
        <BaseCard
            shadowColor="fuschia"
            size="small"
            hoverable
            class="past-book-card"
        >
            <BookInfo :book="book" :isLink="true" />
        </BaseCard>
    </RouterLink>
</template>

<script setup lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BookInfo from "@/components/features/common/BookInfo/index.vue";
import type { Book } from "@/types";

const props = defineProps<{
    book: Book;
}>();
</script>

<style scoped>
.past-book-link {
    width: 360px;
    height: 220px;
}

.past-book-card {
    height: 100%;
}

/* Responsive width adjustments */
@media (max-width: 768px) {
    .past-book-link {
        width: 100%;
        max-width: 360px;
    }
}
</style>
