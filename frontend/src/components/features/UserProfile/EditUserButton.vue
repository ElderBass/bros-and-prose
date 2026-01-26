<template>
    <BaseMenu accentColor="blue" hoverColor="lavender" location="top start">
        <template #activator="{ props: menuProps }">
            <IconButton
                v-if="useIconButton"
                v-bind="menuProps"
                :icon="faMarker"
                :handleClick="() => {}"
                title="edit your dumbass details"
                :size="buttonSize"
            />
            <BaseButton
                v-else
                v-bind="menuProps"
                variant="outline"
                :size="buttonSize"
                title="edit your dumbass details"
                @click="() => {}"
                >edit your dumb ass</BaseButton
            >
        </template>
        <template #items>
            <v-list-item @click="openModal('avatar')">
                <v-list-item-title>change avatar</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openModal('username')">
                <v-list-item-title>change username</v-list-item-title>
            </v-list-item>
        </template>
    </BaseMenu>

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
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import AvatarSelectorModal from "@/components/modal/AvatarSelectorModal.vue";
import ChangeUsernameModal from "@/components/modal/ChangeUsernameModal.vue";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@/composables";
import {
    PROFILE_UPDATED_SUCCESS_ALERT,
    USERNAME_UPDATED_SUCCESS_ALERT,
} from "@/constants";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";

withDefaults(
    defineProps<{
        useIconButton?: boolean;
    }>(),
    {
        useIconButton: true,
    }
);

const { mobile } = useDisplay();
const { updateUserAvatar, updateUserUsername } = useUser();
const { loggedInUser } = storeToRefs(useUserStore());
const { showAlert } = useUIStore();

const activeModal = ref<"avatar" | "username" | "">("");

const openModal = (modal: "avatar" | "username") => {
    activeModal.value = modal;
};

const closeModal = () => {
    activeModal.value = "";
};

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

const isAvatarModalOpen = computed(() => {
    return activeModal.value === "avatar";
});

const isUsernameModalOpen = computed(() => {
    return activeModal.value === "username";
});

const handleConfirmAvatar = async (newAvatar: string) => {
    await updateUserAvatar(loggedInUser.value.id, newAvatar);
    showAlert(PROFILE_UPDATED_SUCCESS_ALERT);
    closeModal();
};

const handleConfirmUsername = (newUsername: string) => {
    updateUserUsername(loggedInUser.value.id, newUsername);
    showAlert(USERNAME_UPDATED_SUCCESS_ALERT);
    closeModal();
};
</script>
