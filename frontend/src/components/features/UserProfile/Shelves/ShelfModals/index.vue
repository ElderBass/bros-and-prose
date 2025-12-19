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
        :showReviewModal="reviewModalOpen"
        :book="selectedBook"
        :bookReview="reviewPrefill"
        :onClose="closeModal"
        :onReviewSubmit="onReviewSubmit"
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
import { useUIStore } from "@/stores/ui";
import { useUser } from "@/composables/useUser";
import { useLog } from "@/composables/useLog";
import type { BookshelfBook, SubmitReviewArgs } from "@/types";
import { DEFAULT_REVIEW, QUICK_ERROR } from "@/constants";
import { useUserStore } from "@/stores/user";

defineOptions({
    name: "ShelfModals",
});

const shelfModalStore = useShelfModalStore();
const { reviewModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const { isAppLoading } = storeToRefs(useUIStore());
const { loggedInUser } = storeToRefs(useUserStore());

const { showAlert } = useUIStore();
const { addReview } = useUser();
const { closeModal } = shelfModalStore;

const reviewPrefill = computed<SubmitReviewArgs>(() => {
    const bookId = selectedBook.value?.id;
    if (!bookId) return DEFAULT_REVIEW;
    const existing = loggedInUser.value?.reviews?.[bookId];
    if (!existing) return DEFAULT_REVIEW;
    return { rating: existing.rating, reviewComment: existing.reviewComment };
});

const onReviewSubmit = async (args: SubmitReviewArgs) => {
    try {
        isAppLoading.value = true;
        await addReview(args, selectedBook.value as BookshelfBook);
    } catch (error) {
        console.error("Error submitting review:", error);
        await useLog().error(`Error in onReviewSubmit: ${error}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happend: ",
                (error as Error).message,
            ])
        );
    } finally {
        closeModal();
        isAppLoading.value = false;
    }
};
</script>
