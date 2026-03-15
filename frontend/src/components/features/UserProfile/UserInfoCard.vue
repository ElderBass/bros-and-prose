<template>
    <UserContentSection>
        <div class="user-info-section">
            <DetailsSection :user="user" :isLoggedInUser="isLoggedInUser" />
        </div>
    </UserContentSection>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import UserContentSection from "./UserContentSection.vue";
import DetailsSection from "./UserInfo/DetailsSection.vue";
import type { User, UserFavorites } from "@/types";

const { isLoggedInUser, user } = defineProps<{
    isLoggedInUser: boolean;
    user: User;
}>();

const userFavorites = ref<UserFavorites | undefined>(user.favorites);

watch(
    () => user,
    (newUser) => {
        userFavorites.value = newUser.favorites;
    }
);
</script>

<style scoped>
.user-info-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--background-color);
}

@media (max-width: 768px) {
    .user-info-section {
        min-height: auto;
        gap: 1.25rem;
        width: 100%;
    }
}
</style>
