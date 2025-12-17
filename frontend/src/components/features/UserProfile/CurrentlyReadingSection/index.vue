<template>
    <UserContentSection :sectionTitle="`CURRENTLY READING (${bookCount})`">
        <div class="currently-reading-section">
            <InfiniteScroll
                v-if="bookCount > 0"
                class="scroll-content pb"
                direction="horizontal"
            >
                <InfoContent
                    v-for="book in currentlyReading"
                    :key="book.id"
                    :currentlyReading="book"
                />
            </InfiniteScroll>
            <NoBookContent v-else :isLoggedInUser="isLoggedInUser" />
        </div>
    </UserContentSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BookshelfBook } from "@/types";
import UserContentSection from "@/components/features/UserProfile/UserContentSection.vue";
import NoBookContent from "@/components/features/UserProfile/CurrentlyReadingSection/NoBookContent.vue";
import InfoContent from "@/components/features/UserProfile/CurrentlyReadingSection/InfoContent.vue";
import InfiniteScroll from "@/components/ui/InfiniteScroll.vue";

defineOptions({ name: "CurrentlyReadingSection" });

const props = withDefaults(
    defineProps<{
        currentlyReading?: BookshelfBook[];
        isLoggedInUser: boolean;
    }>(),
    {
        currentlyReading: () => [],
    }
);

const bookCount = computed(() => props.currentlyReading?.length || 0);
</script>

<style scoped>
.currently-reading-section {
    width: 100%;
    min-height: 160px;
    padding: 0.5rem;
}

.scroll-content {
    display: flex;
    gap: 1rem;
}

.pb {
    padding-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .currently-reading-section {
        min-height: 120px;
        gap: 1rem;
    }

    .content {
        font-size: 1rem;
    }

    .scroll-content {
        gap: 0.75rem;
    }
}
</style>
