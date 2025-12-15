<template>
    <UserContentSection sectionTitle="shelves">
        <WantToReadSection
            :wantToRead="wantToRead"
            :isLoggedInUser="isLoggedInUser"
        />
        <HaveReadSection
            :haveRead="haveRead || []"
            :isLoggedInUser="isLoggedInUser"
        />
    </UserContentSection>
</template>

<script setup lang="ts">
import UserContentSection from "@/components/features/UserProfile/UserContentSection.vue";
import HaveReadSection from "./HaveReadSection/index.vue";
import WantToReadSection from "@/components/features/UserProfile/Shelves/WantToReadSection/index.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    isLoggedInUser: boolean;
    wantToRead: BookshelfBook[];
    haveRead: BookshelfBook[];
}>();
</script>
