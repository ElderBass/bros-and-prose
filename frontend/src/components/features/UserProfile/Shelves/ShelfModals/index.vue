<template>
    <AddBookModal />
    <EditBookModal />
    <BookActionSuccessModal />
    <ShelfErrorModal />
    <ConfirmDeleteBookModal />
    <ConfirmMoveBookModal />
    <ConfirmFinishCurrentBookModal />
    <UserRateAndReviewModal
        v-if="reviewModalOpen && selectedBook"
        :open="reviewModalOpen"
        :book="selectedBook"
        :reviewPrefill="reviewPrefill"
        @close="closeModal"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import AddBookModal from "./AddBookModal/index.vue";
import EditBookModal from "./EditBookModal/index.vue";
import BookActionSuccessModal from "./BookActionSuccessModal.vue";
import ShelfErrorModal from "./ShelfErrorModal.vue";
import ConfirmDeleteBookModal from "./ConfirmRemoveModal.vue";
import ConfirmMoveBookModal from "./ConfirmMoveModal.vue";
import ConfirmFinishCurrentBookModal from "./ConfirmFinishCurrentBook.vue";
import UserRateAndReviewModal from "@/components/modal/UserRateAndReviewModal.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import type { SubmitReviewArgs } from "@/types";
import { DEFAULT_REVIEW } from "@/constants";
import { useUserStore } from "@/stores/user";

defineOptions({
    name: "ShelfModals",
});

const shelfModalStore = useShelfModalStore();
const { reviewModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const { loggedInUser } = storeToRefs(useUserStore());

const { closeModal } = shelfModalStore;

const reviewPrefill = computed<SubmitReviewArgs>(() => {
    const bookId = selectedBook.value?.id;
    if (!bookId) return DEFAULT_REVIEW;
    const existing = loggedInUser.value?.reviews?.[bookId];
    if (!existing) return DEFAULT_REVIEW;
    return { rating: existing.rating, reviewComment: existing.reviewComment };
});
</script>
