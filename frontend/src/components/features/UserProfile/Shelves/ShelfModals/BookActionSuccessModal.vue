<template>
    <BaseModal
        :modelValue="bookActionSuccessModalOpen"
        @close="closeModal"
        :title="modalTitle"
        :size="modalSize"
        shadow-color="green"
        :header-icon="faCheckCircle"
    >
        <div class="success-modal-content">
            <p class="success-message">
                <span class="book-title">{{ bookTitle }}</span>
                {{ actionVerbPhrase }}
                <span class="shelf-name">{{ shelfDisplayName }}</span>
                shelf!
            </p>
            <p v-if="secondaryMessage" class="secondary-message">
                {{ secondaryMessage }}
            </p>
            <BaseButton
                v-if="showReviewButton"
                variant="tertiary"
                title="review that shit"
                @click="openReview"
                :size="mobile ? 'small' : 'medium'"
            >
                leave a review
            </BaseButton>
        </div>
        <template #footer>
            <BaseButton
                variant="outline-secondary"
                title="close this modal"
                @click="closeModal"
                v-bind="buttonProps"
            >
                close
            </BaseButton>
            <BaseButton
                v-if="showAddAnotherButton"
                variant="success"
                title="add another book to your shelf"
                @click="openAddBook(selectedBookShelf as Shelf)"
                v-bind="buttonProps"
            >
                add another
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "@/components/ui/BaseModal.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import type { ButtonSize } from "@/types";
import { HAVE_READ } from "@/constants";
import { getShelfDisplayName } from "@/utils";
import type { Shelf } from "@/types";

const shelfModalStore = useShelfModalStore();
const {
    bookActionSuccessModalOpen,
    selectedBook,
    selectedBookShelf,
    bookActionType,
    message,
} = storeToRefs(shelfModalStore);

const { closeModal, openAddBook, openReview } = shelfModalStore;

const { mobile } = useDisplay();

const bookTitle = computed(() => {
    return selectedBook.value?.title;
});

const shelfDisplayName = computed(() => {
    return getShelfDisplayName(selectedBookShelf.value as Shelf);
});

const modalTitle = computed(() => {
    if (bookActionType.value === "update") return "book updated";
    if (bookActionType.value === "remove") return "book removed";
    return "book added to shelf";
});

const actionVerbPhrase = computed(() => {
    if (bookActionType.value === "update") return "has been updated in your ";
    if (bookActionType.value === "remove") return "has been removed from your ";
    return "has been added to your ";
});

const showReviewButton = computed(() => {
    return (
        bookActionType.value === "add" && shelfDisplayName.value === HAVE_READ
    );
});

const showAddAnotherButton = computed(() => {
    return bookActionType.value === "add";
});

const secondaryMessage = computed(() => message.value || "");

const modalSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const buttonProps = computed(() => {
    return {
        size: mobile.value ? ("small" as ButtonSize) : ("medium" as ButtonSize),
        style: mobile.value ? { width: "100%" } : {},
    };
});
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
