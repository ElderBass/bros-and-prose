<template>
    <TabsContainer
        v-model="activeTab"
        :tabs="shelfTabs"
        headerTitle="SHELVES"
        :dynamicHeight="true"
    >
        <template #currentlyReading>
            <CurrentlyReadingTabContent
                :currentlyReading="currentlyReading"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>

        <template #wantToRead>
            <WantToReadTabContent
                :wantToRead="wantToRead"
                :isLoggedInUser="isLoggedInUser"
            />
        </template>

        <template #haveRead>
            <HaveReadTabContent :haveRead="haveRead" />
        </template>
    </TabsContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabsContainer, {
    type TabConfig,
} from "@/components/ui/TabsContainer.vue";
import CurrentlyReadingTabContent from "./TabContent/CurrentlyReadingTabContent.vue";
import WantToReadTabContent from "./TabContent/WantToReadTabContent.vue";
import HaveReadTabContent from "./TabContent/HaveReadTabContent.vue";
import type { BookshelfBook } from "@/types";

defineProps<{
    currentlyReading: BookshelfBook[];
    wantToRead: BookshelfBook[];
    haveRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const shelfTabs: TabConfig[] = [
    { id: "currentlyReading", label: "present", color: "blue" },
    { id: "wantToRead", label: "future", color: "yellow" },
    { id: "haveRead", label: "past", color: "green" },
];

const activeTab = ref<string>("currentlyReading");
</script>
