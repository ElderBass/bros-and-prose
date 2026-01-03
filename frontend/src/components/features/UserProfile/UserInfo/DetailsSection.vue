<template>
    <div class="user">
        <div class="header">
            <AvatarImage
                :icon="currentIcon"
                :size="mobile ? 'small' : 'medium'"
            />
            <div class="user-name">
                <h2>{{ user?.username }}</h2>
                <p>
                    {{ user?.firstName?.toLowerCase() }}
                    {{ user?.lastName?.toLowerCase() }}
                </p>
            </div>
        </div>

        <div class="details">
            <div class="current-progress">
                <p>current book progress:</p>
                <span class="current-progress-percentage">
                    {{ currentProgress }}%
                </span>
            </div>
        </div>
        <EditUserButton v-if="isLoggedInUser" :useIconButton="false" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import EditUserButton from "@/components/features/UserProfile/EditUserButton.vue";
import { AVATAR_ICON_LIST } from "@/constants";
import type { User } from "@/types";
import { getProgressPercentage } from "@/utils";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";

const { user, isLoggedInUser } = defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();

const { mobile } = useDisplay();

const currentIcon = computed(() => {
    return (
        AVATAR_ICON_LIST.find((icon) => icon.iconName === user.avatar) ??
        faUserAstronaut
    );
});

const currentProgress = computed(() => {
    return getProgressPercentage(user.currentBookProgress);
});
</script>

<style scoped>
.user {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.5rem;
    min-width: 0; /* allow children to shrink instead of overflowing */
}

.header {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
}

.user-name {
    display: flex;
    flex-direction: column;
}

.details {
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.header h2 {
    margin: 0;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
    font-size: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.details p {
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.current-progress {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.current-progress-percentage {
    font-size: 1.05rem;
    font-weight: 600;
    opacity: 0.8;
    color: var(--accent-blue);
}

@media (max-width: 768px) {
    .user-info-section {
        min-height: 110px;
        gap: 1rem;
        width: 100%;
        padding: 1rem 0.75rem;
    }
    .header h2 {
        font-size: 1rem;
    }
    .current-progress {
        gap: 0.5rem;
    }
    .current-progress-percentage {
        font-size: 0.95rem;
    }
}
</style>
