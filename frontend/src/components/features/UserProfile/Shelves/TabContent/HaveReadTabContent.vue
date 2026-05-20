<template>
    <div class="tab-content">
        <div v-if="!hasContent" class="empty-state">
            <p class="empty-message">{{ noContentMessage }}</p>
        </div>
        <div v-else class="content">
            <HaveReadTable
                :books="haveRead"
                :reviewUser="user"
                :heightPx="tableHeightPx"
                :isLoggedInUser="isLoggedInUser"
            />
            <HaveReadBookDetailsModal
                v-if="selectedBook"
                :open="bookDetailsModalOpen"
                :book="selectedBook"
                :review="selectedReview"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import HaveReadTable from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadTable.vue";
import HaveReadBookDetailsModal from "@/components/features/UserProfile/Shelves/HaveReadSection/HaveReadBookDetailsModal.vue";
import type { BookshelfBook, Review, User } from "@/types";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getBookReview } from "@/utils";

const props = defineProps<{
    user: User;
    haveRead: BookshelfBook[];
    isLoggedInUser: boolean;
}>();

const { selectedBook } = storeToRefs(useShelfModalStore());
const { bookDetailsModalOpen } = storeToRefs(useShelfModalStore());

const selectedReview = computed<Review | null>(() => {
    if (!selectedBook.value) return null;
    return getBookReview(props.user, selectedBook.value.id);
});

const { mobile } = useDisplay();
const tableHeightPx = computed(() => (mobile.value ? 400 : 540));

const hasContent = computed(() => props.haveRead.length > 0);

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no books on your have read list yet — add some books to get started."
        : "no books on this user's have read list yet — they probably don't want to read anything anyway."
);
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
    gap: 1rem;
    padding: 2rem 1rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--accent-blue) 3%, transparent);
    min-height: 120px;
}

.empty-message {
    margin: 0;
    font-style: italic;
    opacity: 0.75;
    font-size: 0.9rem;
    text-align: center;
}

@media (max-width: 768px) {
    .tab-content {
        padding: 0.75rem;
        min-height: 160px;
    }

    .empty-state {
        padding: 1.5rem 0.75rem;
        min-height: 100px;
    }
}
</style>
