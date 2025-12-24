<template>
    <BaseCard
        class="current-book-other-bros-progress"
        shadow-color="green"
        size="medium"
    >
        <h3>where the bros at?</h3>
        <LoadingSpinner
            v-if="loading"
            size="medium"
            message="loading bros progress..."
        />
        <div
            v-else-if="!loading && bros.length"
            class="other-bros-progress-container"
        >
            <BroProgressItem
                v-for="bro in bros"
                :key="bro.id"
                :bro-name="bro.username"
                :bro-avatar="getAvatar(bro.avatar)"
                :has-finished="hasFinishedCurrentBook(bro)"
                :progress-string="getProgressString(bro, book?.totalPages)"
                :on-peep-review-click="() => onPeepReviewClick(bro)"
            />
        </div>
        <div v-else class="no-bros-container">
            <p>all your friends are dead</p>
        </div>
    </BaseCard>
    <OtherBroReviewModal
        v-if="showOtherBroReviewModal"
        :open="showOtherBroReviewModal"
        :book="book"
        :brosName="selectedBro.firstName"
        :brosReview="selectedBro?.reviews[book?.id] || {}"
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
import { hasFinishedCurrentBook, getAvatar, getProgressString } from "@/utils";

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
    const allBros = await useUser().getOtherBros();
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
    gap: 0.75rem;
}

.no-bros-container {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.no-bros-container p {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-fuschia);
    font-style: italic;
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
        gap: 0.5rem;
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
