<template>
    <BaseCard shadowColor="green" size="medium">
        <h3>what the bros thought</h3>
        <div class="bro-reviews-container">
            <BroProgressItem
                v-for="broReview in broReviews"
                :key="broReview.reviewer?.username"
                :bro-name="broReview.reviewer?.username || 'oofda'"
                :bro-avatar="broReview.reviewer?.avatar"
                :bro-avatar-type="broReview.reviewer?.avatarType || 'icon'"
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
        :open="showUserReviewModal"
        :book="book"
        :reviewPrefill="selectedBroReview"
        @lose="() => setShowUserReviewModal(false)"
    />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import type { Book, BroReview, Review } from "@/types";
import BroProgressItem from "../common/BroProgressItem.vue";
import OtherBroReviewModal from "@/components/modal/OtherBroReviewModal.vue";
import UserReviewModal from "@/components/modal/UserRateAndReviewModal.vue";
import { getRatingReviewString } from "@/utils";
import { useUserStore } from "@/stores/user";

const { loggedInUser } = storeToRefs(useUserStore());

const { mobile } = useDisplay();

defineProps<{
    book: Book;
    broReviews: BroReview[];
}>();

const showOtherBroReviewModal = ref(false);
const selectedBroName = ref("");
const selectedBroReview = ref({} as Review);
const showUserReviewModal = ref(false);
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
