<template>
    <AppLayout>
        <PageTitle>
            <template v-if="isLoggedInUserProfile">
                check urself / wreck urself
            </template>
            <template v-else>
                checking out <span class="username">@{{ username }}</span>
            </template>
        </PageTitle>
        <LoadingSpinnerContainer
            v-if="loading"
            size="large"
            message="retrieving the user..."
        />
        <div v-else class="profile-content">
            <UserInfoCard
                v-if="targetUser"
                :isLoggedInUser="isLoggedInUserProfile"
                :user="targetUser"
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
import { computed, onMounted, ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
import FloatingActionButton from "../ui/FloatingActionButton.vue";
import AddBookModal from "../modal/AddBookModal.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/stores/user";
import { useUser } from "@/composables/useUser";
import type { User } from "@/types";
import { useLog } from "@/composables/useLog";

const { username } = defineProps<{
    username: string;
}>();

const loading = ref(true);
const targetUser = ref<User | null>(null);

onMounted(async () => {
    try {
        loading.value = true;
        const storedUser = useUserStore().loggedInUser;
        if (storedUser?.username === username) {
            targetUser.value = storedUser;
        } else {
            targetUser.value = await useUser().getUserByUsername(username);
        }
        console.log("KERTWANGING targetUser", targetUser.value);
    } catch (error) {
        console.error("Error fetching user", error);
        await useLog().error(`Error fetching user: ${error}`);
    } finally {
        loading.value = false;
    }
});
const isLoggedInUserProfile = computed(() => {
    const loggedInUser = useUserStore().loggedInUser;
    return loggedInUser.username === username;
});

const addBookModalOpen = ref(false);
const areBookshelvesEnabled = ref(false);

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

.username {
    color: var(--accent-fuschia);
    font-weight: 600;
}
</style>
