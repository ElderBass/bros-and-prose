<template>
    <AppLayout>
        <h1 class="future-books-title">
            <span class="username">@{{ futureBookSelectorUsername }}'s</span>
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
            :currentSelectorUsername="futureBookSelectorUsername"
            :openAddFutureBookModal="openAddFutureBookModal"
        />
        <AddFutureBookFab
            v-if="userIsFutureBookSelector"
            @click="openAddFutureBookModal"
        />
        <AddFutureBookModal
            v-if="showAddFutureBookModal"
            :open="showAddFutureBookModal"
            :onSubmit="onSubmit"
            @close="showAddFutureBookModal = false"
        />
        <SuccessModal
            v-if="showSuccessModal"
            :open="showSuccessModal"
            @close="showSuccessModal = false"
        >
            <p class="book-title">{{ resultMessage[0] }}</p>
            <p>{{ resultMessage[1] }}</p>
        </SuccessModal>
        <ErrorModal
            v-if="showErrorModal"
            :open="showErrorModal"
            @close="showErrorModal = false"
        >
            <p class="book-title">{{ resultMessage[0] }}</p>
            <p>{{ resultMessage[1] }}</p>
        </ErrorModal>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import AddFutureBookFab from "@/components/features/FutureBooks/AddFutureBookFab.vue";
import AddFutureBookModal from "@/components/modal/AddFutureBookModal.vue";
import SuccessModal from "@/components/modal/SuccessModal.vue";
import ErrorModal from "@/components/modal/ErrorModal.vue";
import FutureBooksContainer from "@/components/features/FutureBooks/FutureBooksContainer.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";
import { useLog } from "@/composables/useLog";
import { useBooks } from "@/composables/useBooks";
import type { FutureBook } from "@/types";

const { addFutureBook } = useBooks();
const { isAppLoading } = storeToRefs(useUIStore());
const { futureBookSelectorUsername, userIsFutureBookSelector } =
    storeToRefs(useUserStore());

const showAddFutureBookModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const resultMessage = ref<string[]>([]);

const openAddFutureBookModal = () => {
    showAddFutureBookModal.value = true;
};

const onSubmit = async (futureBook: FutureBook) => {
    try {
        useUIStore().setIsAppLoading(true);
        await addFutureBook(futureBook);
        showAddFutureBookModal.value = false;
        showSuccessModal.value = true;
        resultMessage.value = [
            `${futureBook.title.toUpperCase()}`,
            "added successfully as a future book.",
        ];
    } catch (error) {
        console.error("error in onSubmit", error);
        await useLog().error(`Error in onSubmit: ${error}`);
        showAddFutureBookModal.value = false;
        showErrorModal.value = true;
        resultMessage.value = [
            `error adding ${futureBook.title} as a future book:`,
            error as string,
        ];
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};
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
