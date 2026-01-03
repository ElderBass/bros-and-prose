<template>
    <UserContentSection>
        <div class="user-info-section">
            <DetailsSection :user="user" :isLoggedInUser="isLoggedInUser" />
            <FavoritesSection
                :favorites="user.favorites"
                :isLoggedInUser="isLoggedInUser"
            />
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
    flex-direction: column;
    gap: 1.5rem;
    background: var(--background-color);
    padding: 0 1.5rem;
    border-radius: 1rem;
}

@media (max-width: 768px) {
    .user-info-section {
        min-height: auto;
        gap: 1.25rem;
        width: 100%;
        padding: 0 1rem;
    }
}
</style>
