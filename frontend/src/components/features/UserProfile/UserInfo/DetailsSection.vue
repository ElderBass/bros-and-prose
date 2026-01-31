<template>
    <div class="user">
        <div class="avatar-and-name">
            <button
                :disabled="!isLoggedInUser"
                class="avatar-button"
                @click="handleAvatarClick"
            >
                <AvatarImage
                    :avatar="user.avatar"
                    :avatarType="user.avatarType || 'icon'"
                    :size="mobile ? 'small' : 'medium'"
                />
            </button>
            <div class="user-name">
                <h2>{{ user?.username }}</h2>
                <p>
                    {{ user?.firstName?.toLowerCase() }}
                    {{ user?.lastName?.toLowerCase() }}
                </p>
            </div>
        </div>
        <div class="progress-and-edit">
            <EditUserButton v-if="isLoggedInUser && mobile" />
            <div class="current-progress">
                <span class="progress-label">current book progress:</span>
                <span class="current-progress-percentage">
                    {{ currentProgress }}%
                </span>
            </div>
            <EditUserButton v-if="isLoggedInUser && !mobile" />
        </div>
    </div>
    <AvatarSelectorModal
        v-if="isLoggedInUser && isAvatarModalOpen"
        :open="isAvatarModalOpen"
        :currentAvatar="user.avatar"
        @close="closeModal"
        @confirm="handleConfirmAvatar"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import AvatarSelectorModal from "@/components/modal/AvatarSelectorModal.vue";
import EditUserButton from "@/components/features/UserProfile/EditUserButton.vue";
import type { User } from "@/types";
import { getProgressPercentage } from "@/utils";
import { useUser } from "@/composables/useUser";
import { PROFILE_UPDATED_SUCCESS_ALERT } from "@/constants";
import { useUIStore } from "@/stores/ui";

const { user, isLoggedInUser } = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();

const { mobile } = useDisplay();

const isAvatarModalOpen = ref(false);

const currentProgress = computed(() => {
    return getProgressPercentage(user.currentBookProgress);
});

const handleAvatarClick = () => {
    if (!isLoggedInUser) return;
    isAvatarModalOpen.value = true;
};

const closeModal = () => {
    isAvatarModalOpen.value = false;
};

const handleConfirmAvatar = async (newAvatar: string) => {
    await useUser().updateUserAvatar(user.id, newAvatar);
    useUIStore().showAlert(PROFILE_UPDATED_SUCCESS_ALERT);
    closeModal();
};
</script>

<style scoped>
.user {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0 0.5rem;
}

.avatar-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.avatar-and-name {
    flex: 1 0 50%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-name {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.user-name h2 {
    margin: 0;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
    font-size: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-name p {
    margin: 0;
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.progress-and-edit {
    flex: 1 0 50%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: space-evenly;
}

.current-progress {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.progress-label {
    font-size: 0.9rem;
    opacity: 0.8;
}

.current-progress-percentage {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--accent-blue);
}

@media (max-width: 768px) {
    .user-header {
        align-items: flex-start;
    }

    .avatar-and-name {
        width: 100%;
    }

    .progress-and-edit {
        flex-direction: column;
        width: 100%;
        justify-content: space-between;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .user-name h2 {
        font-size: 1.1rem;
    }

    .progress-label {
        font-size: 0.85rem;
    }

    .current-progress-percentage {
        font-size: 0.95rem;
    }
}
</style>
