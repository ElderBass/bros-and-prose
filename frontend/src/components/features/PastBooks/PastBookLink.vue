<template>
    <RouterLink class="router-link-wrapper" :to="`/past/${props.book.id}`">
        <BaseCard shadowColor="fuschia" size="medium" hoverable>
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
