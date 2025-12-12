<template>
    <UserContentSection sectionTitle="activity">
        <ReviewsSection
            :reviews="reviews"
            :username="user.username"
            :isLoggedInUser="isLoggedInUser"
        />
        <PalaverSection :entries="entries" :isLoggedInUser="isLoggedInUser" />
    </UserContentSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReviewsSection from "./ReviewsSection.vue";
import PalaverSection from "./PalaverSection.vue";
import type { User } from "@/types";
import { getUserContent } from "@/utils";
import { useUserStore } from "@/stores/user";
import UserContentSection from "./UserContentSection.vue";

const props = defineProps<{
    user: User;
}>();

const reviews = computed(() => Object.values(props.user.reviews || {}));
const entries = computed(() => getUserContent(props.user.id));
const isLoggedInUser = computed(
    () => props.user.id === useUserStore().loggedInUser.id
);
</script>
