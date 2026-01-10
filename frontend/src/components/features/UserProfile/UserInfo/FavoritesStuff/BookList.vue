<template>
    <div class="book-list">
        <InfiniteScroll direction="horizontal" height="100%" @load="handleLoad">
            <BookListColumn
                v-for="(column, index) in displayedColumns"
                :key="index"
                :books="column"
                @click="openBookModal"
            />
        </InfiniteScroll>
        <div class="button-wrapper">
            <IconButton
                v-if="!isGuestUser()"
                :icon="faMarker"
                title="edit list"
                size="small"
                color="blue"
                :handleClick="onEditList"
            />
        </div>
    </div>

    <BookDetailsModal
        v-if="!isGuestUser()"
        :open="detailsModalOpen"
        :book="selectedBook"
        @close="closeBookModal"
    />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BookListColumn from "./BookListColumn.vue";
import BookDetailsModal from "@/components/features/UserProfile/UserInfo/FavoritesStuff/BookDetailsModal.vue";
import InfiniteScroll from "@/components/ui/InfiniteScroll.vue";
import type { BookshelfBook, FavoriteType } from "@/types";
import { getBookItemColumns } from "@/utils";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useFavoritesModalStore } from "@/stores/favoritesModal";
import { isGuestUser } from "@/utils";

const { items, type } = defineProps<{
    items: string[];
    type: FavoriteType;
}>();

const BATCH_SIZE = 6; // 6 columns at a time = 12 books

const displayedColumns = ref<BookshelfBook[][]>([]);
const selectedBook = ref<BookshelfBook | null>(null);
const detailsModalOpen = ref(false);
const currentIndex = ref(0);

const incomingColumns = computed(() => {
    return getBookItemColumns(items);
});

// Initialize with first batch
if (incomingColumns.value.length > 0) {
    displayedColumns.value = incomingColumns.value.slice(
        0,
        Math.min(BATCH_SIZE, incomingColumns.value.length)
    );
    currentIndex.value = displayedColumns.value.length;
}

const hasMoreColumns = computed(() => {
    return currentIndex.value < incomingColumns.value.length;
});

const handleLoad = ({ done }: { done: (status: "ok" | "empty") => void }) => {
    if (!hasMoreColumns.value) {
        done("empty");
        return;
    }

    setTimeout(() => {
        const nextBatch = incomingColumns.value.slice(
            currentIndex.value,
            currentIndex.value + BATCH_SIZE
        );
        displayedColumns.value.push(...nextBatch);
        currentIndex.value += nextBatch.length;
        done("ok");
    }, 100);
};

const openBookModal = (book: BookshelfBook) => {
    selectedBook.value = book;
    detailsModalOpen.value = true;
};

const closeBookModal = () => {
    detailsModalOpen.value = false;
    selectedBook.value = null;
};

const onEditList = () => {
    useFavoritesModalStore().openEditModal(type);
};
</script>

<style scoped>
.book-list {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.25rem;
    overflow-x: auto;
    height: 100%;
}

.button-wrapper {
    align-self: center;
    padding: 0 0.25rem;
}

:deep(.v-infinite-scroll) {
    gap: 0.75rem;
    padding: 0.75rem 0.5rem;
}

@media (max-width: 768px) {
    .book-list {
        gap: 0.125rem;
    }

    :deep(.v-infinite-scroll) {
        padding: 0.5rem 0.25rem;
        gap: 0.5rem;
    }
}
</style>
