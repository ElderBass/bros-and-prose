<template>
    <UserContentSection>
        <div class="user-info-section">
            <div class="content">
                <div class="user">
                    <AvatarImage
                        :icon="currentIcon"
                        :size="mobile ? 'small' : 'medium'"
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
    </UserContentSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import EditUserButton from "@/components/features/UserProfile/EditUserButton.vue";
import UserContentSection from "./UserContentSection.vue";
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
    width: 100%;
    min-height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
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
    flex: 1 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    gap: 1rem;
    font-size: 1.05rem;
    min-width: 0; /* allow children to shrink instead of overflowing */
}

.user {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-width: 0;
    flex: 1 1 auto;
}

.name {
    min-width: 0;
}

.name h2 {
    margin: 0;
    color: var(--accent-blue);
    font-family: "Libre Baskerville", serif;
    font-size: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.name p {
    margin: 0.15rem 0 0;
    opacity: 0.9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.current-progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
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
    .name h2 {
        font-size: 1rem;
    }
    .content {
        font-size: 0.85rem;
        gap: 0.75rem;
    }
    .current-progress {
        gap: 0.5rem;
    }
    .current-progress-percentage {
        font-size: 0.95rem;
    }
}
</style>
