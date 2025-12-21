<template>
    <BaseModal
        :modelValue="editBookModalOpen"
        @close="closeModal"
        title="edit book"
        size="large"
        shadow-color="blue"
    >
        <LoadingSpinnerContainer
            v-if="loading"
            size="large"
            message="updating book..."
        />
        <div v-else class="shelf-form">
            <ShelfSelector
                :selectedShelf="selectedBookShelf"
                @selectShelf="selectedBookShelf = $event"
                :disabled="true"
            />
            <EditBookFormV2
                v-if="selectedBook"
                :book="selectedBook"
                :selectedShelf="selectedBookShelf"
                :shelfMessage="shelfMessage"
                :shelfDisplayName="shelfDisplayName"
                @submitting="loading = $event"
            />
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import BaseModal from "@/components/ui/BaseModal.vue";
import ShelfSelector from "../ShelfSelector.vue";
import EditBookFormV2 from "./EditBookFormV2.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfDisplayName, getShelfMessage } from "@/utils/bookshelfUtils";

defineOptions({
    name: "EditBookModal",
});

const shelfModalStore = useShelfModalStore();
const { editBookModalOpen, selectedBook, selectedBookShelf } =
    storeToRefs(shelfModalStore);

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
