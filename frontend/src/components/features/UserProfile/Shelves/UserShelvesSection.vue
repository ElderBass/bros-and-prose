<template>
    <UserContentSection sectionTitle="shelves">
        <WantToReadSection
            :wantToRead="wantToRead"
            :isLoggedInUser="isLoggedInUser"
        />
        <HaveReadSection :hasRead="hasRead" :isLoggedInUser="isLoggedInUser" />
    </UserContentSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UserContentSection from "@/components/features/UserProfile/UserContentSection.vue";
import HaveReadSection from "./HaveReadSection.vue";
import WantToReadSection from "./WantToReadSection.vue";

defineProps<{
    isLoggedInUser: boolean;
}>();

const hasRead = computed(() => []);
const wantToRead = computed(() => []);
</script>
