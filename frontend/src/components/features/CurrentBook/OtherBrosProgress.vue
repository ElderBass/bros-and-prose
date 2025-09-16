<template>
    <BaseCard
        class="current-book-other-bros-progress"
        shadow-color="green"
        size="medium"
    >
        <h3>where your bros at?</h3>
        <LoadingSpinner
            v-if="loading"
            size="medium"
            message="loading bros progress..."
        />
        <div v-else class="other-bros-progress-container">
            <BroProgressItem
                v-for="bro in bros"
                :key="bro.id"
                :bro-name="bro.firstName"
                :has-finished="hasFinishedBook(bro, book.totalPages)"
                :progress-string="getProgressString(bro, book.totalPages)"
                :on-peep-review-click="() => onPeepReviewClick(bro)"
            />
        </div>
    </BaseCard>
    <OtherBroReviewModal
        :showModal="showOtherBroReviewModal"
        :book="book"
        :brosName="selectedBro.firstName"
        :brosReview="selectedBro.reviews[book.id] || {}"
        :onClose="() => setShowOtherBroReviewModal(false)"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import BroProgressItem from "../common/BroProgressItem.vue";
import OtherBroReviewModal from "@/components/modal/OtherBroReviewModal.vue";
import { useUser } from "@/composables/useUser";
import type { User, Book } from "@/types";
import { hasFinishedBook, getProgressString } from "@/utils";

defineProps<{
    book: Book;
}>();

const loading = ref(true);
const bros = ref([] as User[]);
const selectedBro = ref({} as User);

const showOtherBroReviewModal = ref(false);

const setShowOtherBroReviewModal = (value: boolean) => {
    showOtherBroReviewModal.value = value;
};

const onPeepReviewClick = (bro: User) => {
    selectedBro.value = bro;
    setShowOtherBroReviewModal(true);
};

onMounted(async () => {
    const allBros = await useUser().getOtherBros(true);
    bros.value = allBros;
    loading.value = false;
});
</script>

<style scoped>
.current-book-other-bros-progress {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.other-bros-progress-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

h3 {
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 0.1rem;
    width: fit-content;
}

@media (max-width: 768px) {
    .current-book-other-bros-progress {
        gap: 0.75rem;
    }

    .other-bros-progress-container {
        gap: 0.75rem;
    }

    h3 {
        font-size: 1.25rem;
        padding-bottom: 0.25rem;
    }

    p {
        font-size: 1.125rem;
    }

    .progress-value {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .current-book-other-bros-progress {
        gap: 0.5rem;
    }

    .other-bros-progress-container {
        gap: 0.5rem;
    }

    h3 {
        font-size: 1.125rem;
        padding-bottom: 0.125rem;
    }

    p {
        font-size: 1rem;
    }

    .progress-value {
        font-size: 0.875rem;
    }
}
</style>
