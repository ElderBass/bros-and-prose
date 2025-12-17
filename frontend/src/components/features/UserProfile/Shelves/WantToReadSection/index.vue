<template>
    <UserContentPanel
        title="want to read"
        :contentCount="wantToRead.length"
        :noContentMessage="noContentMessage"
        scrollDirection="horizontal"
        color="yellow"
    >
        <template #scroll-content>
            <WantToReadListItem
                v-for="book in wantToRead"
                :key="book.id"
                :book="book"
                :showActions="isLoggedInUser"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserContentPanel from "@/components/features/UserProfile/UserContentPanel.vue";
import WantToReadListItem from "@/components/features/UserProfile/Shelves/WantToReadSection/WantToReadListItem.vue";
import type { BookshelfBook } from "@/types";

defineOptions({
    name: "WantToReadSection",
});

const props = defineProps<{
    wantToRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your want to read list yet — add some books to get started."
        : "no books on this user's want to read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped></style>
