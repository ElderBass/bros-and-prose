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
            <MainUserInfoSection
                v-if="user"
                :user="user"
                :isLoggedInUser="isLoggedInUser"
            />
            <div class="secondary-content">
                <UserShelvesSection
                    :isLoggedInUser="isLoggedInUser"
                    :currentlyReading="currentlyReading"
                    :wantToRead="wantToRead"
                    :haveRead="haveRead"
                />
                <UserActivitySection :user="user" />
            </div>
        </div>
        <ProfileFab v-if="isLoggedInUser" />
        <PalaverModals v-if="isLoggedInUser" />
        <ShelfModals />
        <FavoritesIntroModal
            :open="showIntroModal"
            @accept="handleIntroAccept"
            @dismiss="handleIntroDismiss"
            @remindLater="handleIntroRemindLater"
        />
        <FavoritesWizard
            :open="showWizard"
            @complete="handleWizardComplete"
            @close="handleWizardClose"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import MainUserInfoSection from "../features/UserProfile/MainUserInfoSection.vue";
import ProfileFab from "../features/UserProfile/ProfileFab.vue";
import UserActivitySection from "../features/UserProfile/UserActivitySection.vue";
import UserShelvesSection from "../features/UserProfile/Shelves/UserShelvesSection.vue";
import PalaverModals from "../modal/PalaverModals/index.vue";
import ShelfModals from "../features/UserProfile/Shelves/ShelfModals/index.vue";
import FavoritesIntroModal from "../features/UserProfile/UserInfo/FavoritesStuff/FavoritesIntroModal.vue";
import FavoritesWizard from "../features/UserProfile/UserInfo/FavoritesStuff/FavoritesWizard/index.vue";
import type { User } from "@/types";
import { useUIStore } from "@/stores/ui";
import { getUserShelves } from "@/utils";
import { shouldShowFavoritesIntro } from "@/utils/favoritesIntroUtils";

const props = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();

const { isAppLoading } = storeToRefs(useUIStore());

const shelves = computed(() => getUserShelves(props.user));
const currentlyReading = computed(() => shelves.value.currentlyReading);
const wantToRead = computed(() => shelves.value.wantToRead);
const haveRead = computed(() => shelves.value.haveRead);

// Favorites intro modal state
const showIntroModal = ref(false);
const showWizard = ref(false);

onMounted(() => {
    // Check if we should show intro on mount
    if (
        props.isLoggedInUser &&
        shouldShowFavoritesIntro(props.isLoggedInUser)
    ) {
        // Delay slightly for smooth transition
        setTimeout(() => {
            showIntroModal.value = true;
        }, 500);
    }
});

const handleIntroAccept = () => {
    showIntroModal.value = false;
    showWizard.value = true;
};

const handleIntroDismiss = () => {
    // Permanent dismissal handled in modal
    showIntroModal.value = false;
};

const handleIntroRemindLater = () => {
    // Timestamp set in modal
    showIntroModal.value = false;
};

const handleWizardComplete = () => {
    showWizard.value = false;
};

const handleWizardClose = () => {
    showWizard.value = false;
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

.secondary-content {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
}

.username {
    color: var(--accent-fuschia);
    font-weight: 600;
}

@media (max-width: 768px) {
    .profile-content {
        margin-top: 1rem;
    }
    .secondary-content {
        width: 100%;
    }
}
</style>
