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
        :bookReview="DEFAULT_REVIEW"
        :onClose="closeModal"
        :onReviewSubmit="onReviewSubmit"
    />
</template>

<script setup lang="ts">
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
import type { FutureBook, SubmitReviewArgs } from "@/types";
import {
    DEFAULT_REVIEW,
    QUICK_ERROR,
    REVIEW_SUBMITTED_SUCCESS_ALERT,
} from "@/constants";

defineOptions({
    name: "ShelfModals",
});

const shelfModalStore = useShelfModalStore();
const { reviewModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const { isAppLoading } = storeToRefs(useUIStore());

const { showAlert } = useUIStore();
const { addReview } = useUser();
const { closeModal } = shelfModalStore;

const onReviewSubmit = async (args: SubmitReviewArgs) => {
    try {
        isAppLoading.value = true;
        await addReview(args, selectedBook.value as FutureBook);
        showAlert(REVIEW_SUBMITTED_SUCCESS_ALERT);
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
