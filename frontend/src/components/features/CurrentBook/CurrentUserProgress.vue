<template>
    <div class="user-progress">
        <div class="progress-info">
            <span class="progress-page-info">
                page {{ userPageNumber }} / {{ props.totalPages }}
            </span>
            <span class="progress-percentage">
                ({{ updatedProgress }}% complete)
            </span>
        </div>
        <ProgressSliderInput
            :initialProgress="initialProgress"
            :progress="updatedProgress"
            :maxPages="props.totalPages"
            @progressChange="handleProgressChange"
            :disabled="!showUpdateProgressForm"
        />
    </div>
    <div class="progress-actions">
        <BaseButton
            v-if="!showUpdateProgressForm"
            @click="handleFinishReading"
            :size="buttonSize"
            variant="outline-secondary"
            title="Finish Reading"
            style="width: 100%"
        >
            <span>finished</span>
        </BaseButton>
        <BaseButton
            v-if="showUpdateProgressForm"
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
</template>

<script setup lang="ts">
import ProgressSliderInput from "@/components/form/ProgressSliderInput.vue";
import { useUserStore } from "@/stores/user";
import { useUser } from "@/composables/useUser";
import { computed, ref, watch, onMounted } from "vue";

const { loggedInUser } = useUserStore();

const showUpdateProgressForm = ref(false);
const updatedProgress = ref(loggedInUser.currentBookProgress);
const initialProgress = ref(loggedInUser.currentBookProgress);

// Watch for changes in the store and update local refs
watch(
    () => loggedInUser.currentBookProgress,
    (newProgress) => {
        if (!showUpdateProgressForm.value) {
            updatedProgress.value = newProgress;
            initialProgress.value = newProgress;
        }
    }
);

const props = defineProps<{
    totalPages: number;
}>();

const handleFinishReading = () => {
    console.log("finish reading");
};

const handleProgressChange = (value: number) => {
    console.log("progress changed", value);
    console.log("initialProgress", initialProgress.value);
    if (value > initialProgress.value) {
        updatedProgress.value = Math.round(value);
    }
};

const setShowUpdateProgressForm = (value: boolean) => {
    showUpdateProgressForm.value = value;
};

const onUpdateClick = async () => {
    if (!showUpdateProgressForm.value) {
        setShowUpdateProgressForm(true);
    } else {
        await useUser().updateUser(loggedInUser.id, {
            ...loggedInUser,
            currentBookProgress: Math.round(updatedProgress.value),
        });
        setShowUpdateProgressForm(false);
    }
};

const onCancelClick = () => {
    setShowUpdateProgressForm(false);
    updatedProgress.value = loggedInUser.currentBookProgress;
};

const updateButtonLabel = computed(() => {
    return showUpdateProgressForm.value ? "confirm" : "update";
});

// TODO: save screen size to state/pinia store on App.vue mount
const buttonSize = computed(() => {
    return window.innerWidth < 768 ? "small" : "medium";
});

const userPageNumber = computed(() => {
    return Math.round(props.totalPages * (updatedProgress.value / 100));
});

onMounted(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
