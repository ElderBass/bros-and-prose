<template>
    <AddBookModal />
    <EditBookModal />
    <BookAddedSuccessModal />
    <ShelfErrorModal />
    <ConfirmDeleteBookModal />
    <ConfirmMoveBookModal />
</template>

<script setup lang="ts">
import AddBookModal from "./AddBookModal/index.vue";
import EditBookModal from "./EditBookModal/index.vue";
import BookAddedSuccessModal from "./BookAddedSuccessModal.vue";
import ShelfErrorModal from "./ShelfErrorModal.vue";
import ConfirmDeleteBookModal from "./ConfirmRemoveModal.vue";
import ConfirmMoveBookModal from "./ConfirmMoveModal.vue";

defineOptions({
    name: "ShelfModals",
});
</script>
