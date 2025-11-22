<template>
    <AppLayout>
        <h1 class="future-books-title">
            <span class="username">@{{ futureBookSelector.username }}'s</span>
            selections
        </h1>
        <div v-if="isAppLoading" class="spinner-container">
            <LoadingSpinner
                size="large"
                message="retrieving the future prose, bros..."
            />
        </div>
        <FutureBooksContainer
            v-else
            :hasReadWriteAccess="userIsFutureBookSelector"
            :currentSelectorUsername="futureBookSelector.username"
            :openAddFutureBookModal="openFormModal"
            :futureBooks="currentSelections"
        />
        <AddFutureBookFab
            v-if="userIsFutureBookSelector && !fabDisabled"
            @click="openFormModal"
            :disabled="fabDisabled"
        />
        <FutureBookModal
            v-if="formModal"
            :open="!!formModal"
            :onSubmit="onSubmitFutureBook"
            @close="closeModal"
        />
        <SuccessModal
            v-if="shouldRenderSuccessModal"
            :open="shouldRenderSuccessModal"
            @close="closeModal"
        >
            <p class="book-title">{{ resultModal?.message[0] }}</p>
            <p>{{ resultModal?.message[1] }}</p>
        </SuccessModal>
        <ErrorModal
            v-if="shouldRenderErrorModal"
            :open="shouldRenderErrorModal"
            @close="closeModal"
        >
            <p class="book-title">{{ resultModal?.message[0] }}</p>
            <p>{{ resultModal?.message[1] }}</p>
        </ErrorModal>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import AddFutureBookFab from "@/components/features/FutureBooks/AddFutureBookFab.vue";
import FutureBookModal from "@/components/modal/FutureBookModal.vue";
import SuccessModal from "@/components/modal/SuccessModal.vue";
import ErrorModal from "@/components/modal/ErrorModal.vue";
import FutureBooksContainer from "@/components/features/FutureBooks/FutureBooksContainer.vue";
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";
import { useLog } from "@/composables/useLog";
import type { FutureBook } from "@/types";
import { useFutureBooksStore } from "@/stores/futureBooks";
import { useFutureBooks } from "@/composables/useFutureBooks";

const { addCurrentSelection, updateCurrentSelection } = useFutureBooks();
const { isAppLoading } = storeToRefs(useUIStore());
const { futureBookSelector, userIsFutureBookSelector } =
    storeToRefs(useUserStore());
const futureBooksStore = useFutureBooksStore();
const { currentSelections, modal } = storeToRefs(futureBooksStore);
const { openFormModal, openResultModal, closeModal } = futureBooksStore;

const formModal = computed(() => {
    if (modal.value?.kind === "form" && modal.value.open) {
        return modal.value;
    }
    return null;
});

const resultModal = computed(() => {
    if (modal.value?.kind === "result" && modal.value.open) {
        return modal.value;
    }
    return null;
});

const onSubmitFutureBook = async (futureBook: FutureBook, isEdit: boolean) => {
    try {
        useUIStore().setIsAppLoading(true);
        if (isEdit) {
            await updateCurrentSelection(futureBook);
        } else {
            await addCurrentSelection(futureBook);
        }
        closeModal();
        const message = isEdit
            ? "updated successfully ferda boys."
            : "added successfully as a future book.";
        openResultModal({
            action: isEdit ? "update" : "create",
            status: "success",
            message: [futureBook.title.toUpperCase(), message],
        });
    } catch (error) {
        console.error("error in onSubmit", error);
        await useLog().error(`Error in onSubmit: ${error}`);
        closeModal();
        const message = isEdit
            ? "error updating future book"
            : "error adding future book";
        openResultModal({
            action: isEdit ? "update" : "create",
            status: "error",
            message: [`${message} ${futureBook.title}:`, error as string],
        });
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};

const shouldRenderSuccessModal = computed(
    () => resultModal.value?.status === "success"
);
const shouldRenderErrorModal = computed(
    () => resultModal.value?.status === "error"
);
const fabDisabled = computed(() => {
    console.log("current future books.length", currentSelections.value.length);
    return currentSelections.value.length >= 3;
});
</script>

<style scoped>
.future-books-title {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    border-bottom: 2px solid var(--accent-blue);
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 0.25rem;
}

.username {
    font-weight: bold;
    font-style: normal;
    color: var(--accent-fuschia);
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

.book-title {
    text-align: center;
    font-size: 1.75rem;
    color: var(--accent-fuschia);
    font-weight: 600;
    font-family: "Libre Baskerville", serif;
}

p {
    text-align: center;
    font-size: 1.5rem;
    color: var(--main-text);
}

@media (min-width: 768px) {
    .future-books-title {
        font-size: 1.75rem;
    }
}
</style>
