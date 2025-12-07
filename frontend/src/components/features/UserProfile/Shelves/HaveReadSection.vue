<template>
    <UserContentPanel
        title="have read"
        :noContentMessage="noContentMessage"
        :hasContent="haveRead.length > 0"
        scrollDirection="vertical"
        color="green"
    >
        <template #scroll-content>
            <div class="have-read-list">
                <HaveReadListItem
                    v-for="book in haveRead"
                    :key="book.id"
                    :book="book"
                />
            </div>
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserContentPanel from "@/components/features/UserProfile/UserContentPanel.vue";
import HaveReadListItem from "./HaveReadListItem.vue";
import type { FutureBook } from "@/types";

const props = defineProps<{
    haveRead: FutureBook[];
    isLoggedInUser: boolean;
}>();

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your have read list yet — add some books to get started."
        : "no books on this user's have read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped>
.have-read-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    height: 400px;
    overflow-y: auto;
}

@media (min-width: 768px) {
    .have-read-list {
        height: 540px;
    }
}
</style>
