<template>
    <AppLayout>
        <PageTitle title="check urself / wreck urself" />
        <div class="profile-content">
            <UserInfoCard />
            <div class="bookshelves-container">
                <!-- <Bookshelf :bookshelf="haveRead" />
                <Bookshelf :bookshelf="currentlyReading" />
                <Bookshelf :bookshelf="wantToRead" /> -->
            </div>
        </div>
        <FloatingActionButton
            :icon="faBookMedical"
            title="add a book"
            @click="openAddBookModal"
        />

        <AddBookModal
            v-if="addBookModalOpen"
            :open="addBookModalOpen"
            @close="addBookModalOpen = false"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
import FloatingActionButton from "../ui/FloatingActionButton.vue";
import AddBookModal from "../modal/AddBookModal.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";

const addBookModalOpen = ref(false);

const openAddBookModal = () => {
    addBookModalOpen.value = true;
};
</script>

<style scoped>
.profile-content {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
}
</style>
