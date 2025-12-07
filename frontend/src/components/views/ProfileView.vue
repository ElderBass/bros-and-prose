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
            <UserShelvesSection
                :isLoggedInUser="isLoggedInUser"
                :wantToRead="wantToRead"
                :haveRead="haveRead"
            />
            <UserActivitySection :user="user" />
        </div>
        <ProfileFab v-if="isLoggedInUser" />
        <PalaverModals v-if="isLoggedInUser" />
    </AppLayout>
</template>

<script setup lang="ts">
import { toRefs, ref, watch } from "vue";
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
import { useUserStore } from "@/stores/user";

const props = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();

const { loggedInUser } = storeToRefs(useUserStore());
const { isLoggedInUser } = toRefs(props);
const user = ref(props.user);
const wantToRead = ref(Object.values(props.user.wantToRead || []));
const haveRead = ref(Object.values(props.user.haveRead || []));

watch(
    [loggedInUser, isLoggedInUser],
    ([newLoggedInUser, isOwnProfile]) => {
        if (isOwnProfile && newLoggedInUser?.id) {
            user.value = newLoggedInUser;
            const updatedWantToRead = Object.values(
                newLoggedInUser.wantToRead || []
            );
            const updatedHaveRead = Object.values(
                newLoggedInUser.haveRead || []
            );
            console.log("KERTWANG updatedWantToRead", updatedWantToRead);
            console.log("KERTWANG updatedHaveRead", updatedHaveRead);
            wantToRead.value = updatedWantToRead;
            haveRead.value = updatedHaveRead;
        }
    },
    { immediate: true }
);

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
