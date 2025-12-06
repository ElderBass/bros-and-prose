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
        <ProfileFab v-if="isLoggedInUser" />
        <PalaverModals v-if="isLoggedInUser" />
    </AppLayout>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import UserInfoCard from "../features/UserProfile/UserInfoCard.vue";
import ProfileFab from "../features/UserProfile/ProfileFab.vue";
import UserActivitySection from "../features/UserProfile/UserActivitySection.vue";
import UserShelvesSection from "../features/UserProfile/Shelves/UserShelvesSection.vue";
import PalaverModals from "../modal/PalaverModals/index.vue";
import type { User } from "@/types";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();
const { user, isLoggedInUser } = toRefs(props);

const { isAppLoading } = storeToRefs(useUIStore());
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
