<template>
    <LoadingSpinner
        v-if="loadingMessage.length"
        size="medium"
        :message="loadingMessage"
    />
    <BaseCard v-else shadowColor="green" size="medium">
        <h3>what the bros thought</h3>
        <div class="bro-reviews-container">
            <BroProgressItem
                v-for="broReview in broReviews"
                :key="broReview.reviewer?.username"
                :bro-name="broReview.reviewer?.username || 'oofda'"
                :bro-avatar="getAvatar(broReview.reviewer?.avatar)"
                :has-finished="true"
                :progress-string="
                    getRatingReviewString(broReview.review, mobile)
                "
                :on-peep-review-click="() => onPeepReviewClick(broReview)"
                :is-logged-in-user="
                    loggedInUserName === broReview.reviewer?.username
                "
            />
        </div>
    </BaseCard>
    <OtherBroReviewModal
        v-if="showOtherBroReviewModal"
        :open="showOtherBroReviewModal"
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
import { ref, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import type { Book, BroReview, Review, SubmitReviewArgs } from "@/types";
import BroProgressItem from "../common/BroProgressItem.vue";
import OtherBroReviewModal from "@/components/modal/OtherBroReviewModal.vue";
import UserReviewModal from "@/components/modal/UserRateAndReviewModal.vue";
import { getRatingReviewString, getAvatar } from "@/utils";
import { useUserStore } from "@/stores/user";
import { useUser } from "@/composables/useUser";
import { DEFAULT_RATING } from "@/constants";
import { storeToRefs } from "pinia";

const { loggedInUser } = storeToRefs(useUserStore());
const { addReview } = useUser();

const { mobile } = useDisplay();

const props = defineProps<{
    book: Book;
    broReviews: BroReview[];
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
const loggedInUserName = ref("");

const setShowOtherBroReviewModal = (value: boolean) => {
    showOtherBroReviewModal.value = value;
};

const setShowUserReviewModal = (show: boolean) => {
    showUserReviewModal.value = show;
};

const onPeepReviewClick = (broReview: BroReview) => {
    if (loggedInUserName.value === broReview.reviewer?.username) {
        selectedBroReview.value = broReview.review;
        setShowUserReviewModal(true);
    } else {
        selectedBroName.value = broReview.reviewer?.username;
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

onMounted(() => {
    loggedInUserName.value = loggedInUser.value.username;
});
watch(loggedInUser, () => {
    loggedInUserName.value = loggedInUser.value.username;
});
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

@media (max-width: 768px) {
    h3 {
        font-size: 1.25rem;
    }
}
</style>
