<template>
    <ProfileView :user="loggedInUser" :isLoggedInUser="true" />
</template>

<script setup lang="ts">
import ProfileView from "./ProfileView.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { loggedInUser } = storeToRefs(useUserStore());
</script>
