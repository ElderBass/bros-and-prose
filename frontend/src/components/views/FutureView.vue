<template>
    <AppLayout>
        <h1 class="future-books-title">
            <span class="username">@{{ futureBookSelector.username }}'s</span>
            books
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
            :openAddFutureBookModal="openAddFutureBookModal"
            :futureBooks="currentSelections"
        />
        <AddFutureBookFab
            v-if="userIsFutureBookSelector && !fabDisabled"
            @click="openAddFutureBookModal"
            :disabled="fabDisabled"
        />
        <FutureBookModal
            v-if="futureBookModal.show"
            :open="futureBookModal.show"
            :onSubmit="onSubmitFutureBook"
            @close="clearFutureBookModal"
        />
        <SuccessModal
            v-if="shouldRenderSuccessModal"
            :open="shouldRenderSuccessModal"
            @close="clearFutureBookResultModal"
        >
            <p class="book-title">{{ futureBookResultModal.message[0] }}</p>
            <p>{{ futureBookResultModal.message[1] }}</p>
        </SuccessModal>
        <ErrorModal
            v-if="shouldRenderErrorModal"
            :open="shouldRenderErrorModal"
            @close="clearFutureBookResultModal"
        >
            <p class="book-title">{{ futureBookResultModal.message[0] }}</p>
            <p>{{ futureBookResultModal.message[1] }}</p>
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
import { useBooks } from "@/composables/useBooks";
import type { FutureBook } from "@/types";
import { useBooksStore } from "@/stores/books";
import { useFutureBooksStore } from "@/stores/futureBooks";

const { addFutureBook, updateFutureBook } = useBooks();
const { isAppLoading } = storeToRefs(useUIStore());
const { futureBookSelector, userIsFutureBookSelector } =
    storeToRefs(useUserStore());
const { currentSelections } = storeToRefs(useFutureBooksStore());

const { futureBookModal, futureBookResultModal } = storeToRefs(useBooksStore());
const {
    setFutureBookModal,
    setFutureBookResultModal,
    clearFutureBookModal,
    clearFutureBookResultModal,
} = useBooksStore();

const openAddFutureBookModal = () =>
    setFutureBookModal({
        show: true,
        futureBook: {} as FutureBook,
    });

const onSubmitFutureBook = async (futureBook: FutureBook, isEdit: boolean) => {
    try {
        useUIStore().setIsAppLoading(true);
        if (isEdit) {
            await updateFutureBook(futureBook.id, futureBook);
        } else {
            await addFutureBook(futureBook);
        }
        clearFutureBookModal();
        const message = isEdit
            ? "updated successfully ferda boys."
            : "added successfully as a future book.";
        setFutureBookResultModal({
            show: true,
            type: "success",
            message: [futureBook.title.toUpperCase(), message],
        });
    } catch (error) {
        console.error("error in onSubmit", error);
        await useLog().error(`Error in onSubmit: ${error}`);
        clearFutureBookModal();
        const message = isEdit
            ? "error updating future book"
            : "error adding future book";
        setFutureBookResultModal({
            show: true,
            type: "error",
            message: [`${message} ${futureBook.title}:`, error as string],
        });
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};

const shouldRenderSuccessModal = computed(
    () =>
        futureBookResultModal.value.show &&
        futureBookResultModal.value.type === "success"
);
const shouldRenderErrorModal = computed(
    () =>
        futureBookResultModal.value.show &&
        futureBookResultModal.value.type === "error"
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
