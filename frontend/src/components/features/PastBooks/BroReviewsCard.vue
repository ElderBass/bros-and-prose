<template>
    <BaseCard shadowColor="green" size="medium">
        <div class="heading">
            <h3>what the bros thought</h3>
            <div class="average-rating-container">
                <p class="average-rating">average score:</p>
                <span class="average-rating-value">{{ aggregateRating }}</span>
            </div>
        </div>
        <div class="bro-reviews-container">
            <BroProgressItem
                v-for="broReview in broReviews"
                :key="broReview.reviewer"
                :bro-name="broReview.reviewer"
                :has-finished="true"
                :progress-string="
                    getRatingReviewString(broReview.review, isMobile)
                "
                :on-peep-review-click="() => onPeepReviewClick(broReview)"
                :is-logged-in-user="
                    loggedInUser.firstName === broReview.reviewer
                "
            />
        </div>
    </BaseCard>
    <OtherBroReviewModal
        v-if="showOtherBroReviewModal"
        :showModal="showOtherBroReviewModal"
        :book="book"
        :brosName="selectedBroName"
        :brosReview="selectedBroReview"
        :onClose="() => setShowOtherBroReviewModal(false)"
    />
    <UserReviewModal
        v-if="showUserReviewModal"
        :showReviewModal="showUserReviewModal"
        :book="book"
        :bookReview="selectedBroReview"
        :onReviewSubmit="onReviewSubmit"
        :onClose="() => setShowUserReviewModal(false)"
    />
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { Book, BroReview, Review, SubmitReviewArgs } from "@/types";
import BroProgressItem from "../common/BroProgressItem.vue";
import OtherBroReviewModal from "@/components/modal/OtherBroReviewModal.vue";
import UserReviewModal from "@/components/modal/UserRateAndReviewModal.vue";
import { getRatingReviewString } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useUser } from "@/composables/useUser";
import { DEFAULT_RATING } from "@/constants";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";

const { loggedInUser } = useUserStore();
const { addReview } = useUser();
const { isMobile } = storeToRefs(useUIStore());

const props = defineProps<{
    book: Book;
    broReviews: BroReview[];
    aggregateRating: string;
}>();

const showOtherBroReviewModal = ref(false);
const selectedBroName = ref("");
const selectedBroReview = ref({} as Review);
const showUserReviewModal = ref(false);
const loadingMessage = ref("");
const bookReview = ref({
    rating: DEFAULT_RATING,
    reviewComment: "",
});

const setShowOtherBroReviewModal = (value: boolean) => {
    showOtherBroReviewModal.value = value;
};

const setShowUserReviewModal = (show: boolean) => {
    showUserReviewModal.value = show;
};

const onPeepReviewClick = (broReview: BroReview) => {
    if (loggedInUser.firstName === broReview.reviewer) {
        selectedBroReview.value = broReview.review;
        setShowUserReviewModal(true);
    } else {
        selectedBroName.value = broReview.reviewer;
        selectedBroReview.value = broReview.review;
        setShowOtherBroReviewModal(true);
    }
};

const onReviewSubmit = async ({ rating, reviewComment }: SubmitReviewArgs) => {
    setShowUserReviewModal(false);
    loadingMessage.value = "updating your shitty review...";
    const udpatedUser = await addReview({ rating, reviewComment }, props.book);

    if (udpatedUser) {
        bookReview.value = udpatedUser.reviews[props.book.id];
    }
    loadingMessage.value = "";
};
</script>

<style scoped>
h3 {
    width: fit-content;
    font-size: 1.5rem;
    padding-bottom: 0.1rem;
    border-bottom: 2px solid var(--accent-blue);
}

.bro-reviews-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.average-rating-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
}

.average-rating {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent-blue);
}

.average-rating-value {
    font-family: "Crimson Text", serif;
    font-style: italic;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--accent-fuschia);
}

@media (max-width: 768px) {
    .heading {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    h3 {
        font-size: 1.25rem;
    }

    .average-rating-container {
        width: 100%;
        justify-content: space-evenly;
    }

    .average-rating-value {
        font-size: 1.5rem;
    }

    .average-rating {
        font-size: 1rem;
    }
}
</style>
