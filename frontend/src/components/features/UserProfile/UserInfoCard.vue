<template>
    <UserContentSection>
        <div class="user-info-section">
            <DetailsSection :user="user" :isLoggedInUser="isLoggedInUser" />
            <FavoritesSection :favorites="user.favorites" />
        </div>
    </UserContentSection>
</template>

<script setup lang="ts">
import UserContentSection from "./UserContentSection.vue";
import DetailsSection from "./UserInfo/DetailsSection.vue";
import FavoritesSection from "./UserInfo/FavoritesSection.vue";
import type { User } from "@/types";

const { isLoggedInUser, user } = defineProps<{
    isLoggedInUser: boolean;
    user: User;
}>();
</script>

<style scoped>
.user-info-section {
    width: 100%;
    min-height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--background-color);
    /* background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-lavender) 12%, transparent),
        color-mix(in srgb, var(--accent-lavender) 6%, transparent)
    );
    border: 2px solid var(--accent-lavender);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow:
        0 4px 8px color-mix(in srgb, var(--accent-lavender) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.05); */
}

@media (max-width: 768px) {
    .user-info-section {
        min-height: 110px;
        gap: 1rem;
        width: 100%;
        padding: 1rem 0.75rem;
    }
}
</style>
