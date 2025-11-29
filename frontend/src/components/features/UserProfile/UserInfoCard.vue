<template>
    <BaseCard
        shadow-color="lavender"
        :style="{ width: mobile ? '100%' : '50%' }"
    >
        <div class="header">
            <div class="user">
                <AvatarImage
                    :icon="currentIcon"
                    :size="mobile ? 'medium' : 'large'"
                />
                <div class="name">
                    <h2>
                        {{ user?.username }}
                    </h2>
                    <p>
                        {{ user?.firstName?.toLowerCase() }}
                        {{ user?.lastName?.toLowerCase() }}
                    </p>
                    <p class="email">{{ user?.email }}</p>
                </div>
            </div>
            <v-menu content-class="profile-actions-menu">
                <template #activator="{ props: menuProps }">
                    <IconButton
                        v-if="isLoggedInUser"
                        v-bind="menuProps"
                        :icon="faMarker"
                        :handleClick="() => {}"
                        title="edit your dumbass details"
                        :size="mobile ? 'small' : 'medium'"
                    />
                </template>
                <v-list>
                    <v-list-item @click="openModal('avatar')">
                        <v-list-item-title>change avatar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="openModal('username')">
                        <v-list-item-title>change username</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </BaseCard>

    <AvatarSelectorModal
        v-if="isAvatarModalOpen"
        :open="isAvatarModalOpen"
        :currentAvatar="loggedInUser.avatar"
        @close="closeModal"
        @confirm="handleConfirmAvatar"
    />
    <ChangeUsernameModal
        v-if="isUsernameModalOpen"
        :open="isUsernameModalOpen"
        :currentUsername="loggedInUser.username"
        @close="closeModal"
        @confirm="handleConfirmUsername"
    />
</template>

<script setup lang="ts">
import AvatarImage from "@/components/ui/AvatarImage.vue";
import AvatarSelectorModal from "@/components/modal/AvatarSelectorModal.vue";
import ChangeUsernameModal from "@/components/modal/ChangeUsernameModal.vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { faMarker, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { computed, ref } from "vue";
import { AVATAR_ICON_LIST } from "@/constants";
import { useUser } from "@/composables/useUser";
import {
    PROFILE_UPDATED_SUCCESS_ALERT,
    USERNAME_UPDATED_SUCCESS_ALERT,
} from "@/constants";
import type { User } from "@/types";

const { isLoggedInUser, user } = defineProps<{
    isLoggedInUser: boolean;
    user: User;
}>();

const { updateUserAvatar, updateUserUsername } = useUser();
const { loggedInUser } = storeToRefs(useUserStore());
const { showAlert } = useUIStore();
const { mobile } = useDisplay();

const activeModal = ref<"avatar" | "username" | "">("");

const currentIcon = computed(() => {
    return (
        AVATAR_ICON_LIST.find(
            (icon) => icon.iconName === loggedInUser.value.avatar
        ) ?? faUserAstronaut
    );
});

const openModal = (modal: "avatar" | "username") => {
    activeModal.value = modal;
};

const closeModal = () => {
    activeModal.value = "";
};

const handleConfirmAvatar = (newAvatar: string) => {
    updateUserAvatar(loggedInUser.value.id, newAvatar);
    showAlert(PROFILE_UPDATED_SUCCESS_ALERT);
    closeModal();
};

const handleConfirmUsername = (newUsername: string) => {
    updateUserUsername(loggedInUser.value.id, newUsername);
    showAlert(USERNAME_UPDATED_SUCCESS_ALERT);
    closeModal();
};

const isAvatarModalOpen = computed(() => {
    return activeModal.value === "avatar";
});

const isUsernameModalOpen = computed(() => {
    return activeModal.value === "username";
});
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
}

.user {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.name h2 {
    margin: 0;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
}

.email {
    opacity: 0.8;
    font-size: 0.9rem;
}

:deep(.profile-actions-menu) {
    background-color: var(--background-color) !important;
    border: 2px solid var(--accent-blue) !important;
    border-radius: 0.75rem;
    overflow: hidden;
}

:deep(.profile-actions-menu .v-list) {
    background-color: transparent !important;
    padding: 0.25rem 0;
}

:deep(.profile-actions-menu .v-list-item) {
    color: var(--accent-blue) !important;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
}

:deep(.profile-actions-menu .v-list-item:hover),
:deep(.profile-actions-menu .v-list-item:focus),
:deep(.profile-actions-menu .v-list-item--active) {
    background-color: var(--accent-lavender) !important;
    color: var(--background-color) !important;
}

@media (max-width: 768px) {
    .name h2 {
        font-size: 1rem;
    }
    .email {
        font-size: 1rem;
    }
}
</style>
