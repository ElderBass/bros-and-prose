<template>
    <div class="user-info-section">
        <div class="content">
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
                    <div class="current-progress">
                        <p>current book progress:</p>
                        <span class="current-progress-percentage">
                            {{ currentProgress }}%
                        </span>
                    </div>
                </div>
            </div>
            <EditUserButton v-if="isLoggedInUser" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import EditUserButton from "@/components/features/UserProfile/EditUserButton.vue";
import { useDisplay } from "vuetify";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { AVATAR_ICON_LIST } from "@/constants";
import type { User } from "@/types";
import { getProgressPercentage } from "@/utils";

const { isLoggedInUser, user } = defineProps<{
    isLoggedInUser: boolean;
    user: User;
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
.user-info-section {
    width: 50%;
    min-height: 160px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-lavender) 12%, transparent),
        color-mix(in srgb, var(--accent-lavender) 6%, transparent)
    );
    border: 2px solid var(--accent-lavender);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow:
        0 4px 8px color-mix(in srgb, var(--accent-lavender) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    gap: 1.5rem;
    font-size: 1.25rem;
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

.current-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.current-progress-percentage {
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0.8;
    font-size: 0.9rem;
    color: var(--accent-blue);
}

@media (max-width: 768px) {
    .user-info-section {
        width: 100%;
        min-height: 120px;
        gap: 1rem;
    }
    .name h2 {
        font-size: 1rem;
    }
    .content {
        font-size: 1rem;
    }
    .current-progress {
        gap: 0.5rem;
    }
}
</style>
