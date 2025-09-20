<template>
    <BaseCard
        shadow-color="lavender"
        :style="{ width: isMobile ? '100%' : '50%' }"
    >
        <div class="header">
            <div class="user">
                <AvatarImage
                    :icon="currentIcon"
                    :size="isMobile ? 'medium' : 'large'"
                />
                <div class="name">
                    <h2>
                        {{ loggedInUser.firstName }}
                        {{ loggedInUser.lastName }}
                    </h2>
                    <p class="email">{{ loggedInUser.email }}</p>
                </div>
            </div>
            <v-menu content-class="profile-actions-menu">
                <template #activator="{ props: menuProps }">
                    <IconButton
                        v-bind="menuProps"
                        :icon="faMarker"
                        :handleClick="() => {}"
                        title="change your stupid avatar"
                        :size="isMobile ? 'medium' : 'large'"
                    />
                </template>
                <v-list>
                    <v-list-item class="menu-item" @click="openModal">
                        <v-list-item-title>change avatar</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </BaseCard>

    <AvatarSelectorModal
        v-if="isModalOpen"
        :open="isModalOpen"
        :currentAvatar="loggedInUser.avatar"
        @close="closeModal"
        @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
import AvatarImage from "@/components/ui/AvatarImage.vue";
import AvatarSelectorModal from "@/components/modal/AvatarSelectorModal.vue";
import { useUserStore } from "@/stores/user";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { faMarker, faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { computed, ref } from "vue";
import { AVATAR_ICON_LIST } from "@/constants";
import { useUser } from "@/composables/useUser";

const { updateUserAvatar } = useUser();
const { loggedInUser } = storeToRefs(useUserStore());
const { isMobile } = storeToRefs(useUIStore());

const isModalOpen = ref(false);

const currentIcon = computed(() => {
    return (
        AVATAR_ICON_LIST.find(
            (icon) => icon.iconName === loggedInUser.value.avatar
        ) ?? faUserAstronaut
    );
});

const openModal = () => {
    console.log("KERTWANGING openModal");
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const handleConfirm = (newAvatar: string) => {
    updateUserAvatar(loggedInUser.value.id, newAvatar);
    closeModal();
};
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
