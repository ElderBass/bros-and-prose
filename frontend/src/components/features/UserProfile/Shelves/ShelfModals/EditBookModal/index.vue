<template>
    <BaseModal
        :modelValue="editBookModalOpen"
        @close="closeModal"
        title="edit book"
        size="large"
        shadow-color="blue"
    >
        <LoadingSpinner
            v-if="loading"
            size="large"
            message="updating book..."
        />
        <div v-else class="shelf-form">
            <ShelfSelector
                :selectedShelf="selectedShelf"
                @selectShelf="selectedShelf = $event"
            />
            <EditBookForm
                v-if="selectedBook"
                :book="selectedBook"
                :selectedShelf="selectedShelf"
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
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ShelfSelector from "../ShelfSelector.vue";
import EditBookForm from "./EditBookForm.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfDisplayName, getShelfMessage } from "@/utils/bookshelfUtils";

defineOptions({
    name: "EditBookModal",
});

const shelfModalStore = useShelfModalStore();
const { editBookModalOpen, selectedBook, selectedBookShelf } =
    storeToRefs(shelfModalStore);

const { closeModal } = shelfModalStore;

const selectedShelf = ref<"wantToRead" | "haveRead">(
    (selectedBookShelf.value as "wantToRead" | "haveRead") || "wantToRead"
);

const loading = ref(false);

const shelfMessage = computed(() => {
    return getShelfMessage(selectedShelf.value);
});

const shelfDisplayName = computed(() => {
    return getShelfDisplayName(selectedShelf.value);
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
