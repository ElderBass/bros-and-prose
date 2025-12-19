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
                @open="openDetails"
            />
            <HaveReadBookDetailsModal
                :open="detailsOpen"
                :book="selectedBook"
                :review="selectedReview"
                :canReview="isLoggedInUser"
                @close="closeDetails"
                @review="startReview"
                @editDetails="startEditDetails"
                @editReview="startEditReview"
            />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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
const shelfModalStore = useShelfModalStore();
const userStore = useUserStore();
const { loggedInUser } = storeToRefs(userStore);

const viewedUsername = computed(
    () => route.params.username as string | undefined
);
const reviewUser = computed<User | null>(() => {
    if (props.isLoggedInUser) return loggedInUser.value;
    if (!viewedUsername.value) return null;
    return userStore.getUserByUsername(viewedUsername.value) ?? null;
});

const selectedBook = ref<BookshelfBook | null>(null);
const detailsOpen = ref(false);

const selectedReview = computed<Review | null>(() => {
    if (!selectedBook.value) return null;
    if (!reviewUser.value) return null;
    return reviewUser.value.reviews?.[selectedBook.value.id] ?? null;
});

const openDetails = (book: BookshelfBook) => {
    selectedBook.value = book;
    detailsOpen.value = true;
};

const closeDetails = () => {
    detailsOpen.value = false;
    selectedBook.value = null;
};

const startReview = (book: BookshelfBook) => {
    // ShelfModals is only mounted on your own profile; keep CTA gated by isLoggedInUser
    if (!props.isLoggedInUser) return;
    closeDetails();
    // Ensure the review modal has a selectedBook to operate on
    shelfModalStore.openReviewForBook(book, "haveRead");
};

const startEditDetails = (book: BookshelfBook) => {
    if (!props.isLoggedInUser) return;
    closeDetails();
    shelfModalStore.openEditBook(book, "haveRead");
};

const startEditReview = (book: BookshelfBook) => {
    if (!props.isLoggedInUser) return;
    closeDetails();
    shelfModalStore.openReviewForBook(book, "haveRead");
};

const { mobile } = useDisplay();
const tableHeightPx = computed(() => (mobile.value ? 400 : 540));

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your have read list yet — add some books to get started."
        : "no books on this user's have read list yet — they probably don't want to read anything anyway."
);
</script>

<style scoped></style>
