<template>
    <div class="main-user-info-section" :class="{ column: mobile }">
        <UserInfoCard :isLoggedInUser="isLoggedInUser" :user="user" />
        <CurrentlyReadingSection :currentlyReading="user.currentlyReading" />
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import UserInfoCard from "./UserInfoCard.vue";
import CurrentlyReadingSection from "./CurrentlyReadingSection.vue";
import type { User } from "@/types";

defineProps<{
    user: User;
    isLoggedInUser: boolean;
}>();

const { mobile } = useDisplay();
</script>

<style scoped>
.main-user-info-section {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
}

.main-user-info-section :deep(.user-info-section),
.main-user-info-section :deep(.currently-reading-section) {
    height: 100%;
}

.column {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

@media (min-width: 768px) {
    .main-user-info-section {
        width: 60%;
    }
}
</style>
