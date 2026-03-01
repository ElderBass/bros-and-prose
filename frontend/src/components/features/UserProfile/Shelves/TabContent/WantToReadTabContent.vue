<template>
    <div class="tab-content">
        <div v-if="!hasContent" class="empty-state">
            <p class="empty-message">{{ noContentMessage }}</p>
        </div>
        <InfiniteScroll v-else direction="horizontal" class="scroll-content">
            <WantToReadListItem
                v-for="book in wantToRead"
                :key="book.id"
                :book="book"
                :isLoggedInUser="isLoggedInUser"
            />
        </InfiniteScroll>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InfiniteScroll from "@/components/ui/InfiniteScroll.vue";
import WantToReadListItem from "@/components/features/UserProfile/Shelves/WantToReadSection/WantToReadListItem.vue";
import type { BookshelfBook } from "@/types";

const props = defineProps<{
    wantToRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const hasContent = computed(() => props.wantToRead.length > 0);

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your want to read list yet — add some books to get started."
        : "no books on this user's want to read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped>
.tab-content {
    padding: 1.25rem;
    min-height: 220px;
    display: flex;
    flex-direction: column;
}

.scroll-content {
    display: flex;
    gap: 1rem;
    padding-bottom: 1rem;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;
}

.empty-message {
    margin: 0;
    font-style: italic;
    opacity: 0.75;
    font-size: 0.9rem;
    text-align: center;
}

@media (max-width: 768px) {
    .tab-content {
        padding: 0.75rem;
        min-height: 160px;
    }

    .scroll-content {
        gap: 0.75rem;
    }

    .empty-state {
        padding: 1.5rem 0.75rem;
        min-height: 100px;
    }
}
</style>
