<template>
    <BaseModal
        :modelValue="addBookModalOpen"
        @close="closeModal"
        title="add a book to your shelf"
        size="large"
        shadow-color="green"
    >
        <LoadingSpinner
            v-if="loading"
            size="large"
            message="adding book to shelf..."
        />
        <div v-else class="shelf-form">
            <ShelfSelector />
            <AddBookForm
                :selectedShelf="selectedBookShelf"
                :shelfMessage="shelfMessage"
                :shelfDisplayName="shelfDisplayName"
            />
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/ui/BaseModal.vue";
import ShelfSelector from "../ShelfSelector.vue";
import AddBookForm from "./AddBookForm.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfDisplayName, getShelfMessage } from "@/utils/bookshelfUtils";

defineOptions({
    name: "AddBookToShelfModal",
});

const shelfModalStore = useShelfModalStore();
const { addBookModalOpen, selectedBookShelf } = storeToRefs(shelfModalStore);

const { closeModal } = shelfModalStore;

const loading = ref(false);

const shelfMessage = computed(() => {
    return getShelfMessage(selectedBookShelf.value);
});

const shelfDisplayName = computed(() => {
    return getShelfDisplayName(selectedBookShelf.value);
});
</script>

<style scoped>
.shelf-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    min-height: 500px;
}

@media (max-width: 768px) {
    .shelf-form {
        gap: 0.75rem;
        min-height: 400px;
    }
}
</style>
