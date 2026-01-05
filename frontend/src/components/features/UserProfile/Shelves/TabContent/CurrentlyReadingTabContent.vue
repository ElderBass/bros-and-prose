<template>
    <div class="tab-content">
        <div v-if="!hasContent" class="empty-state">
            <NoBookContent :isLoggedInUser="isLoggedInUser" />
        </div>
        <div v-else class="content">
            <CarouselSection
                :currentlyReading="currentlyReading"
                :isLoggedInUser="isLoggedInUser"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NoBookContent from "@/components/features/UserProfile/Shelves/CurrentlyReadingSection/NoBookContent.vue";
import CarouselSection from "@/components/features/UserProfile/Shelves/CurrentlyReadingSection/CarouselSection.vue";
import type { BookshelfBook } from "@/types";

const props = defineProps<{
    currentlyReading: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const hasContent = computed(() => props.currentlyReading.length > 0);
</script>

<style scoped>
.tab-content {
    padding: 1.25rem;
    min-height: 220px;
    display: flex;
    flex-direction: column;
}

.content {
    width: 100%;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
}

@media (max-width: 768px) {
    .tab-content {
        padding: 0.75rem;
        min-height: 160px;
    }
}
</style>
