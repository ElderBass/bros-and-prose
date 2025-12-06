<template>
    <BaseModal
        :modelValue="addBookSuccessModalOpen"
        @close="closeModal"
        title="book added to shelf"
        size="small"
        shadow-color="green"
        :header-icon="faCheckCircle"
    >
        <div class="success-modal-content">
            <p class="success-message">
                <span class="book-title">{{ bookTitle }}</span> has been added
                to your
                <span class="shelf-name">{{ shelfDisplayName }}</span> shelf!
            </p>
        </div>
        <template #footer>
            <BaseButton
                variant="outline-secondary"
                :size="mobile ? 'small' : 'medium'"
                title="close this modal"
                @click="closeModal"
                :style="{ width: mobile ? '100%' : '50%' }"
            >
                close
            </BaseButton>
            <BaseButton
                variant="success"
                :size="mobile ? 'small' : 'medium'"
                title="add another book to your shelf"
                @click="openAddBook"
                :style="{ width: mobile ? '100%' : '50%' }"
            >
                add another
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";

const shelfModalStore = useShelfModalStore();
const { addBookSuccessModalOpen, bookTitle, shelfDisplayName } =
    storeToRefs(shelfModalStore);

const { closeModal, openAddBook } = shelfModalStore;

const { mobile } = useDisplay();
</script>

<style scoped>
.success-modal-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
}

.success-message {
    font-size: 1.5rem;
    color: var(--main-text);
    line-height: 1.6;
    margin: 0;
}

.book-title {
    color: var(--accent-blue);
    font-weight: 600;
    font-style: italic;
}

.shelf-name {
    color: var(--accent-green);
    font-weight: 600;
}

.secondary-message {
    font-size: 1.25rem;
    color: var(--accent-fuschia);
    font-style: italic;
    margin: 0;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .success-modal-content {
        padding: 1rem;
    }

    .success-message {
        font-size: 1.25rem;
    }

    .secondary-message {
        font-size: 1.1rem;
    }
}
</style>
