<template>
    <UserContentPanel
        title="have read"
        :contentCount="haveRead.length"
        :noContentMessage="noContentMessage"
        scrollDirection="vertical"
        color="green"
    >
        <template #content>
            <HaveReadTable
                :books="haveRead"
                :reviewUser="user"
                :heightPx="tableHeightPx"
                :isLoggedInUser="isLoggedInUser"
            />
            <HaveReadBookDetailsModal
                v-if="selectedBook"
                :open="bookDetailsModalOpen"
                :book="selectedBook"
                :review="selectedReview"
                :canReview="isLoggedInUser"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import UserContentPanel from "@/components/features/UserProfile/UserContentPanel.vue";
import HaveReadTable from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadTable.vue";
import HaveReadBookDetailsModal from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadBookDetailsModal.vue";
import type { BookshelfBook, Review, User } from "@/types";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useDisplay } from "vuetify";
import { getBookReview } from "@/utils";

defineOptions({
    name: "HaveReadSection",
});

const props = defineProps<{
    user: User;
    haveRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const { bookDetailsModalOpen } = storeToRefs(useShelfModalStore());
const { selectedBook } = storeToRefs(useShelfModalStore());

const selectedReview = computed<Review | null>(() => {
    if (!selectedBook.value) return null;
    return getBookReview(props.user, selectedBook.value.id);
});

const { mobile } = useDisplay();
const tableHeightPx = computed(() => (mobile.value ? 400 : 540));

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your have read list yet — add some books to get started."
        : "no books on this user's have read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped></style>
