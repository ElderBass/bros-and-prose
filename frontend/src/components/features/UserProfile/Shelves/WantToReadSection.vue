<template>
    <UserContentPanel
        title="want to read"
        :noContentMessage="noContentMessage"
        :hasContent="wantToRead.length > 0"
        scrollDirection="vertical"
        color="blue"
    >
        <template #scroll-content>
            <div class="want-to-read-list">
                <WantToReadListItem
                    v-for="book in wantToRead"
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
import WantToReadListItem from "./WantToReadListItem.vue";
import type { Book } from "@/types";

const props = defineProps<{
    wantToRead: Book[];
    isLoggedInUser: boolean;
}>();

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your want to read list yet — add some books to get started."
        : "no books on this user's want to read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped></style>
