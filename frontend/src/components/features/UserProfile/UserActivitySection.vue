<template>
    <UserContentSection sectionTitle="activity">
        <ProseSection
            :proseEntries="userProseEntries"
            :isLoggedInUser="isLoggedInUser"
        />
        <PalaverSection :entries="entries" :isLoggedInUser="isLoggedInUser" />
        <ReviewsSection
            :reviews="reviews"
            :username="user.username"
            :isLoggedInUser="isLoggedInUser"
        />
    </UserContentSection>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import ReviewsSection from "./ReviewsSection.vue";
import PalaverSection from "./PalaverSection.vue";
import ProseSection from "./ProseSection.vue";
import type { User } from "@/types";
import { getUserContent } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useProseStore } from "@/stores/prose";
import UserContentSection from "./UserContentSection.vue";

const props = defineProps<{
    user: User;
}>();

const { entries: proseEntries } = storeToRefs(useProseStore());

const reviews = computed(() => Object.values(props.user.reviews || {}));
const entries = computed(() => getUserContent(props.user.id));
const userProseEntries = computed(() =>
    proseEntries.value.filter(
        (e) => e.userInfo?.username === props.user.username
    )
);
const isLoggedInUser = computed(
    () => props.user.id === useUserStore().loggedInUser.id
);
</script>
