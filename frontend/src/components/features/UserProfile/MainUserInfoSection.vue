<template>
    <div class="main-user-info-section" :class="{ column: mobile }">
        <UserInfoCard :isLoggedInUser="isLoggedInUser" :user="user" />
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import UserInfoCard from "./UserInfoCard.vue";
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
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
}

.column {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .main-user-info-section {
        width: 60%;
        gap: 1rem;
    }
    .column {
        gap: 1rem;
    }
}
</style>
