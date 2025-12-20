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
    </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "../ui/PageTitle.vue";
import MainUserInfoSection from "../features/UserProfile/MainUserInfoSection.vue";
import ProfileFab from "../features/UserProfile/ProfileFab.vue";
import UserActivitySection from "../features/UserProfile/UserActivitySection.vue";
import UserShelvesSection from "../features/UserProfile/Shelves/UserShelvesSection.vue";
import PalaverModals from "../modal/PalaverModals/index.vue";
import type { User } from "@/types";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { getUserShelves } from "@/utils";

const props = defineProps<{
    user: User;
}>();

const { loggedInUser } = storeToRefs(useUserStore());

const isLoggedInUser = computed(() => {
    const viewedId = props.user?.id;
    const loggedInId = loggedInUser.value?.id;
    return Boolean(viewedId && loggedInId && viewedId === loggedInId);
});

const user = computed<User>(() => {
    if (isLoggedInUser.value && loggedInUser.value?.id)
        return loggedInUser.value;
    return props.user;
});

const shelves = computed(() => getUserShelves(user.value));
const currentlyReading = computed(() => shelves.value.currentlyReading);
const wantToRead = computed(() => shelves.value.wantToRead);
const haveRead = computed(() => shelves.value.haveRead);

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
