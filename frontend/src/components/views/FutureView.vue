<template>
    <AppLayout>
        <PageTitle title="future prose" />
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
            v-if="userIsFutureBookSelector && showAddFutureBookModal"
            :open="showAddFutureBookModal"
            @close="showAddFutureBookModal = false"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import AddFutureBookFab from "@/components/features/FutureBooks/AddFutureBookFab.vue";
import AddFutureBookModal from "@/components/modal/AddFutureBookModal.vue";
import FutureBooksContainer from "@/components/features/FutureBooks/FutureBooksContainer.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const { isAppLoading } = storeToRefs(useUIStore());
const showAddFutureBookModal = ref(false);
const { futureBookSelectorUsername, userIsFutureBookSelector } =
    storeToRefs(useUserStore());

const openAddFutureBookModal = () => {
    showAddFutureBookModal.value = true;
};
</script>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

h3 {
    padding: 2rem;
    font-size: 1.5rem;
    color: var(--accent-blue);
    text-align: center;
}

p {
    font-size: 1.25rem;
    color: var(--main-text);
    text-align: center;
}
</style>
