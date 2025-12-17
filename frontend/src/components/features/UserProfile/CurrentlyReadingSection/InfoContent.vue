<template>
    <BookshelfBookListItem
        :book="currentlyReading"
        shelf="currentlyReading"
        :showActions="showActions"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook } from "@/types";
import { useRouter } from "vue-router";
import BookshelfBookListItem from "@/components/features/UserProfile/Shelves/BookshelfBookListItem.vue";

defineProps<{
    currentlyReading: BookshelfBook;
}>();

const showActions = computed(() => {
    const router = useRouter();
    return router.currentRoute.value.name === "profile-root";
});
</script>

<style scoped></style>
