<template>
    <div class="user-progress">
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
    <div class="progress-actions">
        <BaseButton
            v-if="!updateModeEnabled"
            @click="() => setShowReviewModal(true)"
            :size="buttonSize"
            variant="outline-secondary"
            title="bro, you done? finish reading book"
            style="width: 100%"
        >
            <span>finished</span>
        </BaseButton>
        <BaseButton
            v-if="updateModeEnabled"
            @click="onCancelClick"
            :size="buttonSize"
            variant="outline-secondary"
            title="cancel this shitty progress update"
            style="width: 100%"
        >
            <span>cancel</span>
        </BaseButton>
        <BaseButton
            @click="onUpdateClick"
            :size="buttonSize"
            :variant="updateButtonConfig.variant"
            title="prove you can read and update your progress"
            style="width: 100%"
        >
            <span>{{ updateButtonConfig.label }}</span>
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ProgressSliderInput from "@/components/form/ProgressSliderInput.vue";
import { useUserStore } from "@/stores/user";
import { useBooksStore } from "@/stores/books";
import { useUIStore } from "@/stores/ui";
import { convertToPercentage, FINISHED_BOOK_PROGRESS } from "@/utils";

const { loggedInUser } = useUserStore();
const { currentBook } = useBooksStore();
const { isMobile } = storeToRefs(useUIStore());

const updateModeEnabled = ref(false);
const updatedProgress = ref(loggedInUser.currentBookProgress);
const initialProgress = ref(loggedInUser.currentBookProgress);

// Watch for changes in the store and update local refs
watch(
    () => loggedInUser.currentBookProgress,
    (newProgress) => {
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
    setShowReviewModal: (show: boolean) => void;
    handleUpdate: (updatedProgress: number) => Promise<void>;
}>();

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
        await props.handleUpdate(updatedProgress.value);
        setUpdateModeEnabled(false);
    }
};

const onCancelClick = () => {
    setUpdateModeEnabled(false);
    updatedProgress.value = loggedInUser.currentBookProgress;
};

const updateButtonConfig = computed(() => {
    return {
        label: updateModeEnabled.value ? "confirm" : "update",
        variant: updateModeEnabled.value ? "outline-success" : "outline",
    };
});

const buttonSize = computed(() => {
    return isMobile ? "small" : "medium";
});

const userPercentage = computed(() => {
    return convertToPercentage(updatedProgress.value, props.totalPages);
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
