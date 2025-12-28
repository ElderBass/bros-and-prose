<template>
    <UserContentPanel
        title="have read"
        :contentCount="haveRead.length"
        :noContentMessage="noContentMessage"
        scrollDirection="vertical"
        color="green"
    >
        <template #content>
            <HaveReadTable
                :books="haveRead"
                :reviewUser="reviewUser"
                :heightPx="tableHeightPx"
            />
            <HaveReadBookDetailsModal
                v-if="selectedBook"
                :open="bookDetailsModalOpen"
                :book="selectedBook"
                :review="selectedReview"
                :canReview="isLoggedInUser"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import UserContentPanel from "@/components/features/UserProfile/UserContentPanel.vue";
import HaveReadTable from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadTable.vue";
import HaveReadBookDetailsModal from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadBookDetailsModal.vue";
import type { BookshelfBook, Review, User } from "@/types";
import { useUserStore } from "@/stores/user";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useDisplay } from "vuetify";

defineOptions({
    name: "HaveReadSection",
});

const props = defineProps<{
    haveRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const route = useRoute();
const userStore = useUserStore();

const { loggedInUser } = storeToRefs(userStore);
const { bookDetailsModalOpen } = storeToRefs(useShelfModalStore());
const { selectedBook } = storeToRefs(useShelfModalStore());

const viewedUsername = computed(
    () => route.params.username as string | undefined
);
const reviewUser = computed<User | null>(() => {
    if (props.isLoggedInUser) return loggedInUser.value;
    if (!viewedUsername.value) return null;
    return userStore.getUserByUsername(viewedUsername.value) ?? null;
});

const selectedReview = computed<Review | null>(() => {
    if (!selectedBook.value) return null;
    if (!reviewUser.value) return null;
    return reviewUser.value.reviews?.[selectedBook.value.id] ?? null;
});

const { mobile } = useDisplay();
const tableHeightPx = computed(() => (mobile.value ? 400 : 540));

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your have read list yet — add some books to get started."
        : "no books on this user's have read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped></style>
