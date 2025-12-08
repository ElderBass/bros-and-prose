<template>
    <div class="have-read-list-item">
        <div class="book-title">{{ book.title }}</div>
        <div class="book-author">{{ book.author }}</div>
        <div v-if="review" class="book-tags">
            <BaseButton
                title="peep review"
                :size="mobile ? 'xsmall' : 'small'"
                variant="outline-tertiary"
                @click="reviewModalOpen = true"
            >
                {{ review.rating }} / 10
            </BaseButton>
        </div>
        <div v-else class="no-review">
            <span class="no-review-text">unreviewed</span>
        </div>
    </div>
    <OtherBroReviewModal
        v-if="review"
        :open="reviewModalOpen"
        :brosName="username"
        :brosReview="review"
        :onClose="() => (reviewModalOpen = false)"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import type { Review, FutureBook, User } from "@/types";
import BaseButton from "@/components/ui/BaseButton.vue";
import OtherBroReviewModal from "@/components/modal/OtherBroReviewModal.vue";
import { getBookReview } from "@/utils";
import { useUserStore } from "@/stores/user";

const router = useRouter();

const props = defineProps<{
    book: FutureBook;
}>();

const review = ref<Review | null>(null);
const reviewModalOpen = ref(false);
const username = ref(router.currentRoute.value.params.username as string);

const { mobile } = useDisplay();

onMounted(() => {
    const user =
        useUserStore().getUserByUsername(
            (router.currentRoute.value.meta.user as User).username
        ) ?? null;
    console.log(" KERTWANG BOOK ID in have read list item??", props.book.id);
    if (user) {
        review.value = getBookReview(user, props.book.id) ?? null;
    }
});
</script>

<style scoped>
.have-read-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    align-items: center;
    padding: 0 0.5rem 0.5rem 0.5rem;
    border-bottom: 1px solid var(--accent-green);
    transition: background-color 0.2s ease;
    width: 95%;
}

.have-read-list-item:hover {
    background-color: color-mix(in srgb, var(--accent-green) 8%, transparent);
}

.book-title {
    flex: 1 0 35%;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-family: "Courier New", serif;
    font-style: italic;
}

.book-author {
    flex: 1 0 35%;
    font-size: 0.8rem;
    color: var(--accent-green);
    text-align: center;
}

.book-tags {
    flex: 1 0 30%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;
}

.no-review {
    flex: 1 0 30%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.no-review-text {
    font-size: 0.85rem;
    color: var(--main-text);
    opacity: 0.75;
    font-style: italic;
}

@media (min-width: 768px) {
    .have-read-list-item {
        justify-content: space-evenly;
        gap: 1.5rem;
        padding: 0 0.75rem 0.75rem 0.75rem;
    }

    .book-title {
        font-size: 1.125rem;
    }

    .book-author {
        font-size: 1rem;
    }

    .no-tags {
        font-size: 1rem;
        font-size: 0.9rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
