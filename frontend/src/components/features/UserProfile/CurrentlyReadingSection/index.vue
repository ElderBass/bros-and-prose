<template>
    <UserContentSection sectionTitle="CURRENTLY READING">
        <div class="currently-reading-section">
            <InfoContent
                v-if="currentlyReading?.id"
                :currentlyReading="currentlyReading"
            />
            <NoBookContent v-else :isLoggedInUser="isLoggedInUser" />
        </div>
    </UserContentSection>
</template>

<script setup lang="ts">
import type { BookshelfBook } from "@/types";
import UserContentSection from "@/components/features/UserProfile/UserContentSection.vue";
import NoBookContent from "@/components/features/UserProfile/CurrentlyReadingSection/NoBookContent.vue";
import InfoContent from "@/components/features/UserProfile/CurrentlyReadingSection/InfoContent.vue";

defineOptions({ name: "CurrentlyReadingSection" });

defineProps<{
    currentlyReading?: BookshelfBook | null;
    isLoggedInUser: boolean;
}>();
</script>

<style scoped>
.currently-reading-section {
    width: 100%;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent-blue) 12%, transparent),
        color-mix(in srgb, var(--accent-blue) 6%, transparent)
    );
    border: 2px solid var(--accent-blue);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow:
        0 4px 8px color-mix(in srgb, var(--accent-blue) 25%, transparent),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
    .currently-reading-section {
        min-height: 120px;
        gap: 1rem;
    }

    .content {
        font-size: 1rem;
    }
}
</style>
