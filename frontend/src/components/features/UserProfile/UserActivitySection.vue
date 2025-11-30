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

<style scoped>
.user-content-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
}

.section-title {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 1rem;
    color: var(--accent-blue);
    margin: 0;
    padding-left: 0.75rem;
}

@media (min-width: 768px) {
    .user-content-section {
        width: 60%;
        gap: 1rem;
    }
}
</style>
