<template>
    <BaseCarousel
        class="carousel"
        :items="currentlyReading"
        :cycle="bookCount > 1"
        :intervalMs="intervalMs"
        :showArrows="showArrows"
        :showDelimiters="bookCount > 1"
    >
        <template #item="{ item }">
            <div class="item-wrap">
                <BookshelfBookListItem
                    :book="item as BookshelfBook"
                    shelf="currentlyReading"
                    :showActions="isLoggedInUser"
                />
            </div>
        </template>
    </BaseCarousel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { BookshelfBook } from "@/types";
import BookshelfBookListItem from "@/components/features/UserProfile/Shelves/BookshelfBookListItem.vue";
import BaseCarousel from "@/components/ui/BaseCarousel.vue";

defineOptions({ name: "CurrentlyReadingCarouselSection" });

const props = withDefaults(
    defineProps<{
        currentlyReading?: BookshelfBook[];
        isLoggedInUser: boolean;
        intervalMs?: number;
    }>(),
    {
        currentlyReading: () => [],
        intervalMs: 6000,
    }
);

const { mobile } = useDisplay();

const bookCount = computed(() => props.currentlyReading.length);
const currentlyReading = computed(() => props.currentlyReading);
const intervalMs = computed(() => props.intervalMs);
const showArrows = computed(() => !mobile.value && bookCount.value > 1);
</script>

<style scoped>
.carousel {
    width: 100%;
}

.item-wrap {
    width: 100%;
    padding: 0;
    display: flex;
    justify-content: center;
}

@media (max-width: 768px) {
    .item-wrap {
        padding: 0;
    }
}
</style>
