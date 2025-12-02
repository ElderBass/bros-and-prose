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
            <UserShelvesSection :isLoggedInUser="isLoggedInUser" />
            <UserActivitySection :user="user" />
        </div>
        <FloatingActionButton
            v-if="false"
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
import { ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
import UserActivitySection from "../features/UserProfile/UserActivitySection.vue";
import UserShelvesSection from "../features/UserProfile/UserShelvesSection.vue";
import AddBookModal from "../modal/AddBookModal.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import type { User } from "@/types";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();
const { user, isLoggedInUser } = toRefs(props);

const { isAppLoading } = storeToRefs(useUIStore());

const addBookModalOpen = ref(false);

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
    gap: 1rem;
    margin-top: 2rem;
}

.username {
    color: var(--accent-fuschia);
    font-weight: 600;
}
</style>
