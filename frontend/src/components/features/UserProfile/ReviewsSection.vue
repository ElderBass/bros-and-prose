<template>
    <UserContentPanel
        title="reviews"
        noContentMessage="zero takes logged. start beefing with some books."
        :contentCount="reviews.length"
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
import ProfileReviewItem from "./ProfileReviewItem.vue";
import type { Review } from "@/types";
import UserContentPanel from "./UserContentPanel.vue";

defineProps<{
    username: string;
    reviews: Review[];
}>();
</script>

<style scoped></style>
