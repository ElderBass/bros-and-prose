<template>
    <div class="shelves-section">
        <ShelfTabs
            :currentlyReading="currentlyReading"
            :wantToRead="wantToRead"
            :haveRead="haveRead || []"
            :isLoggedInUser="isLoggedInUser"
        />
    </div>
</template>

<script setup lang="ts">
import ShelfTabs from "./ShelfTabs.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    isLoggedInUser: boolean;
    currentlyReading: BookshelfBook[];
    wantToRead: BookshelfBook[];
    haveRead: BookshelfBook[];
}>();
</script>

<style scoped>
.shelves-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
