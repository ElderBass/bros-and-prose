<template>
    <UserContentPanel
        :title="title"
        noContentMessage="zero takes logged. start beefing with some books."
        :hasContent="reviews.length > 0"
        color="lavender"
    >
        <template #scroll-content>
            <ProfileReviewItem
                v-for="review in reviews"
                :key="review.id"
                :review="review"
                :username="username"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProfileReviewItem from "./ProfileReviewItem.vue";
import type { Review } from "@/types";
import UserContentPanel from "./UserContentPanel.vue";

const props = defineProps<{
    username: string;
    reviews: Review[];
}>();

const title = computed(() => `reviews (${props.reviews?.length || 0})`);
</script>

<style scoped></style>
