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
            <ShelfSelector
                :selectedShelf="selectedShelf"
                @selectShelf="selectedShelf = $event"
            />
            <AddBookForm
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
import ShelfSelector from "../ShelfSelector.vue";
import AddBookForm from "./AddBookForm.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfDisplayName, getShelfMessage } from "@/utils/bookshelfUtils";
import type { Shelf } from "@/types";

defineOptions({
    name: "AddBookToShelfModal",
});

const shelfModalStore = useShelfModalStore();
const { addBookModalOpen } = storeToRefs(shelfModalStore);

const { closeModal } = shelfModalStore;

const selectedShelf = ref<Shelf>("haveRead");

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

.stock-text {
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-blue);
    margin: 0;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.form-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 200px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
}

.label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.title-label {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-fuschia);
    padding-left: 0.5rem;
}

.no-book-details {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
    .shelf-form {
        gap: 0.75rem;
        min-height: 400px;
    }

    .shelf-selector {
        gap: 0.5rem;
    }

    .form {
        gap: 0.75rem;
    }

    .form-row {
        flex-direction: column;
        gap: 0.75rem;
    }

    .form-actions {
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .title-label {
        font-size: 1.25rem;
    }

    .label {
        font-size: 1.1rem;
    }

    .no-book-details {
        min-height: 150px;
        font-size: 1.125rem;
        padding: 1rem;
    }

    .stock-text {
        font-size: 1.125rem;
    }
}
</style>
