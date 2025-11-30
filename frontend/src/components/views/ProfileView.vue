<template>
    <AppLayout>
        <PageTitle>
            <template v-if="isLoggedInUser">
                check urself / wreck urself
            </template>
            <template v-else>
                checking out <span class="username">@{{ user.username }}</span>
            </template>
        </PageTitle>
        <LoadingSpinnerContainer
            v-if="isAppLoading"
            size="large"
            message="retrieving the user..."
        />
        <div v-else class="profile-content">
            <UserInfoCard
                v-if="user"
                :isLoggedInUser="isLoggedInUser"
                :user="user"
            />
            <ReviewsSection
                v-if="user"
                :username="user.username"
                :reviews="userReviews"
                :heading="reviewsHeading"
            />
            <div class="bookshelves-container">
                <!-- <Bookshelf :bookshelf="haveRead" />
                <Bookshelf :bookshelf="currentlyReading" />
                <Bookshelf :bookshelf="wantToRead" /> -->
            </div>
        </div>
        <FloatingActionButton
            v-if="areBookshelvesEnabled"
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
import { computed, ref, toRefs } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
import ReviewsSection from "../features/UserProfile/ReviewsSection.vue";
import FloatingActionButton from "../ui/FloatingActionButton.vue";
import AddBookModal from "../modal/AddBookModal.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/types";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();
const { user, isLoggedInUser } = toRefs(props);

const { isAppLoading } = storeToRefs(useUIStore());

const addBookModalOpen = ref(false);
const areBookshelvesEnabled = ref(false);

const userReviews = computed(() => Object.values(user.value?.reviews || {}));
const reviewsHeading = computed(() =>
    isLoggedInUser.value
        ? "shit you've said about books"
        : `shit ${user.value?.username || "this bro"} said about books`
);

const openAddBookModal = () => {
    addBookModalOpen.value = true;
};
</script>

<style scoped>
.profile-content {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: 2rem;
}

.username {
    color: var(--accent-fuschia);
    font-weight: 600;
}
</style>
