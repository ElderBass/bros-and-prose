<template>
    <AddBookModal />
    <EditBookModal />
    <BookActionSuccessModal />
    <ShelfErrorModal />
    <ConfirmDeleteBookModal />
    <ConfirmMoveBookModal />
    <ConfirmFinishCurrentBookModal />
</template>

<script setup lang="ts">
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import AddBookModal from "./AddBookModal/index.vue";
import EditBookModal from "./EditBookModal/index.vue";
import BookActionSuccessModal from "./BookActionSuccessModal.vue";
import ShelfErrorModal from "./ShelfErrorModal.vue";
import ConfirmDeleteBookModal from "./ConfirmRemoveModal.vue";
import ConfirmMoveBookModal from "./ConfirmMoveModal.vue";
import ConfirmFinishCurrentBookModal from "./ConfirmFinishCurrentBook.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

defineOptions({
    name: "ShelfModals",
});

const shelfModalStore = useShelfModalStore();
const { reviewModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const router = useRouter();

const { closeModal } = shelfModalStore;

watch([reviewModalOpen, selectedBook], ([open, book]) => {
    if (!open || !book) return;
    router.push({
        name: "book-review",
        params: { bookId: book.id },
        query: { source: "shelf", returnTo: "/profile" },
    });
    closeModal();
});
</script>
