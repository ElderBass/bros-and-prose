<template>
    <div v-if="!loadingMessage.length" class="user-progress">
        <div class="progress-info">
            <span class="progress-page-info">
                page {{ updatedProgress }} / {{ props.totalPages }}
            </span>
            <span class="progress-percentage">
                ({{ userPercentage }}% complete)
            </span>
        </div>
        <ProgressSliderInput
            :progress="updatedProgress"
            :maxPages="props.totalPages"
            @progressChange="handleProgressChange"
            :disabled="!updateModeEnabled"
        />
    </div>
    <LoadingSpinner
        v-if="loadingMessage.length"
        size="medium"
        :message="loadingMessage"
    />
    <div class="progress-actions">
        <BaseButton
            v-if="!updateModeEnabled"
            @click="handleFinishReading"
            :size="buttonSize"
            variant="outline-secondary"
            title="Finish Reading"
            style="width: 100%"
        >
            <span>finished</span>
        </BaseButton>
        <BaseButton
            v-if="updateModeEnabled"
            @click="onCancelClick"
            :size="buttonSize"
            variant="outline-secondary"
            title="Cancel"
            style="width: 100%"
        >
            <span>cancel</span>
        </BaseButton>
        <BaseButton
            @click="onUpdateClick"
            :size="buttonSize"
            variant="primary"
            title="Update Current Book Progress"
            style="width: 100%"
        >
            <span>{{ updateButtonLabel }}</span>
        </BaseButton>
    </div>
    <BaseModal
        v-model="showRateAndReviewModal"
        title="what'dya think, bro?"
        size="medium"
    >
        <RateAndReviewBookForm
            :currentBook="currentBook"
            :handleCancel="closeReviewModal"
            :handleSubmit="onReviewSubmit"
        />
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import ProgressSliderInput from "@/components/form/ProgressSliderInput.vue";
import RateAndReviewBookForm from "@/components/form/RateAndReviewBookForm.vue";
import { useUserStore } from "@/stores/user";
import { useBooksStore } from "@/stores/books";
import { useUser } from "@/composables/useUser";
import type { SubmitReviewArgs } from "@/types";
import { convertToPercentage, FINISHED_BOOK_PROGRESS } from "@/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const { updateUser, addReview } = useUser();
const { loggedInUser } = useUserStore();
const { currentBook } = useBooksStore();

const loadingMessage = ref("");
const updateModeEnabled = ref(false);
const showRateAndReviewModal = ref(false);
const updatedProgress = ref(loggedInUser.currentBookProgress);
const initialProgress = ref(loggedInUser.currentBookProgress);
const hasFinishedBook = ref(false);

// Watch for changes in the store and update local refs
watch(
    () => loggedInUser.currentBookProgress,
    (newProgress) => {
        console.log("\n KERTWANG newProgress??", newProgress);
        if (newProgress === FINISHED_BOOK_PROGRESS) {
            updatedProgress.value = currentBook.totalPages;
            initialProgress.value = currentBook.totalPages;
        } else if (!updateModeEnabled.value) {
            updatedProgress.value = newProgress;
            initialProgress.value = newProgress;
        }
    }
);

const props = defineProps<{
    totalPages: number;
}>();

const handleFinishReading = () => {
    showRateAndReviewModal.value = true;
};

const closeReviewModal = () => (showRateAndReviewModal.value = false);

const handleProgressChange = (value: number) => {
    if (value >= initialProgress.value) {
        updatedProgress.value = Math.round(value);
    }
};

const setUpdateModeEnabled = (value: boolean) => {
    updateModeEnabled.value = value;
};

const onUpdateClick = async () => {
    if (!updateModeEnabled.value) {
        setUpdateModeEnabled(true);
    } else {
        loadingMessage.value = "updating your measly progress...";
        await updateUser(loggedInUser.id, {
            ...loggedInUser,
            currentBookProgress: Math.round(updatedProgress.value),
        });
        setUpdateModeEnabled(false);
        loadingMessage.value = "";

        if (updatedProgress.value === currentBook.totalPages) {
            showRateAndReviewModal.value = true;
        }
    }
};

const onCancelClick = () => {
    setUpdateModeEnabled(false);
    updatedProgress.value = loggedInUser.currentBookProgress;
};

const onReviewSubmit = async ({ rating, reviewComment }: SubmitReviewArgs) => {
    showRateAndReviewModal.value = false;
    loadingMessage.value = "submitting your shitty review...";
    await addReview({ rating, reviewComment }, currentBook);
    loadingMessage.value = "";
};

const updateButtonLabel = computed(() => {
    return updateModeEnabled.value ? "confirm" : "update";
});

// TODO: save screen size to state/pinia store on App.vue mount
const buttonSize = computed(() => {
    return window.innerWidth < 768 ? "small" : "medium";
});

const userPercentage = computed(() => {
    return convertToPercentage(updatedProgress.value, props.totalPages);
});

onMounted(() => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
    });
    if (loggedInUser.currentBookProgress === FINISHED_BOOK_PROGRESS) {
        hasFinishedBook.value = true;
    }
});
</script>

<style scoped>
.user-progress {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 1rem;
    width: 100%;
}
.progress-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.25rem;
    width: 100%;
}
.progress-percentage {
    font-weight: 600;
    color: var(--accent-lavender);
}
.progress-page-info {
    color: var(--accent-fuschia);
}
.progress-actions {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
    gap: 1rem;
}

@media (min-width: 768px) {
    .progress-info {
        font-size: 1.75rem;
        gap: 2rem;
    }
    .progress-percentage {
        font-size: 1.75rem;
    }
}
</style>
