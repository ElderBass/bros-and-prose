<template>
    <ProfileView :user="user" :isLoggedInUser="false" />
</template>

<script setup lang="ts">
import ProfileView from "./ProfileView.vue";
import type { User } from "@/types";

defineProps<{
    user: User;
}>();
</script>
