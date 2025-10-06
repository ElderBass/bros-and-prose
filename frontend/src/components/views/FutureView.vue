<template>
    <AppLayout>
        <PageTitle title="future prose" />
        <!-- <h3>i simply haven't made it this far...</h3>
        <p>so...here's an alternate future:</p>
        <div class="video-container">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/xvZqHgFz51I?si=dEPQXJQ_qUY3N91y"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
            ></iframe>
        </div> -->
        <FutureBooksContainer
            :hasReadWriteAccess="false"
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
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { FUTURE_BOOK_SELECTOR } from "@/constants";

const showAddFutureBookModal = ref(false);
const { loggedInUser, futureBookSelectorUsername } =
    storeToRefs(useUserStore());

const openAddFutureBookModal = () => {
    showAddFutureBookModal.value = true;
};

const userIsFutureBookSelector = computed(() => {
    return loggedInUser.value && loggedInUser.value.id === FUTURE_BOOK_SELECTOR;
});
</script>

<style scoped>
.video-container {
    display: flex;
    align-items: center;
    justify-content: center;
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
