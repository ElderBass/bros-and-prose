<template>
    <BaseCard
        shadow-color="lavender"
        :style="{
            width: mobile ? '100%' : '50%',
            minHeight: mobile ? '120px' : '160px',
        }"
    >
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
                    <p class="email">{{ user?.email }}</p>
                </div>
            </div>
            <EditUserButton v-if="isLoggedInUser" />
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AvatarImage from "@/components/ui/AvatarImage.vue";
import EditUserButton from "@/components/features/UserProfile/EditUserButton.vue";
import { useDisplay } from "vuetify";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { AVATAR_ICON_LIST } from "@/constants";
import type { User } from "@/types";

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
</script>

<style scoped>
.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
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

@media (max-width: 768px) {
    .name h2 {
        font-size: 1rem;
    }
    .email {
        font-size: 1rem;
    }
}
</style>
