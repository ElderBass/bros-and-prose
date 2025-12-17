<template>
    <UserContentPanel
        title="currently reading"
        :contentCount="currentlyReading.length"
        scrollDirection="horizontal"
        color="blue"
        :defaultOpen="true"
    >
        <template #empty>
            <NoBookContent :isLoggedInUser="isLoggedInUser" />
        </template>

        <template #scroll-content>
            <BookshelfBookListItem
                v-for="book in currentlyReading"
                :key="book.id"
                :book="book"
                shelf="currentlyReading"
                :showActions="isLoggedInUser"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import UserContentPanel from "@/components/features/UserProfile/UserContentPanel.vue";
import NoBookContent from "@/components/features/UserProfile/Shelves/CurrentlyReadingSection/NoBookContent.vue";
import BookshelfBookListItem from "@/components/features/UserProfile/Shelves/BookshelfBookListItem.vue";
import type { BookshelfBook } from "@/types";

defineOptions({ name: "CurrentlyReadingShelfSection" });

defineProps<{
    currentlyReading: BookshelfBook[];
    isLoggedInUser: boolean;
}>();
</script>

<style scoped></style>
