<template>
    <div class="book-recommendation-details">
        <div class="tags" v-if="recommendation.tags?.length">
            <BookTag
                v-for="tag in recommendation.tags"
                :key="tag"
                :tag="tag"
                :selected="true"
                color="blue"
                :size="mobile ? 'small' : 'medium'"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Recommendation } from "@/types/palaver";
import { useDisplay } from "vuetify";
import BookTag from "@/components/ui/BookTag.vue";

defineProps<{ recommendation: Recommendation }>();

const { mobile } = useDisplay();
</script>

<style scoped>
.book-recommendation-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
}

.tags {
    display: flex;
    gap: 0.25rem;
}
</style>
