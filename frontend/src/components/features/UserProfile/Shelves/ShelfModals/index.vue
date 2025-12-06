<template>
    <AddBookModal />
    <BookAddedSuccessModal />
    <ShelfErrorModal />
</template>

<script setup lang="ts">
import AddBookModal from "./AddBookModal/index.vue";
import BookAddedSuccessModal from "./BookAddedSuccessModal.vue";
import ShelfErrorModal from "./ShelfErrorModal.vue";

defineOptions({
    name: "ShelfModals",
});
</script>
