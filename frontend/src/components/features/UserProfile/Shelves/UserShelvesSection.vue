<template>
    <UserContentSection sectionTitle="shelves">
        <CurrentlyReadingSection
            :currentlyReading="currentlyReading"
            :isLoggedInUser="isLoggedInUser"
        />
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
import CurrentlyReadingSection from "@/components/features/UserProfile/Shelves/CurrentlyReadingSection/index.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    isLoggedInUser: boolean;
    currentlyReading: BookshelfBook[];
    wantToRead: BookshelfBook[];
    haveRead: BookshelfBook[];
}>();
</script>
