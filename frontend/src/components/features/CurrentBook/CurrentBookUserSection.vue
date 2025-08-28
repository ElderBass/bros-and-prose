<template>
    <BaseCard shadowColor="fuschia" size="medium">
        <div class="user-content">
            <div class="user-progress">
                <h3>your progress</h3>
                <div class="progress-info">
                    <span class="progress-percentage">
                        {{ user.currentBookProgress }}%
                    </span>
                    <span class="progress-page-info">
                        (page {{ userPageNumber }} / {{ props.totalPages }})
                    </span>
                </div>
                <ProgressBar :progress="user.currentBookProgress" />
            </div>
            <div class="progress-actions">
                <BaseButton
                    @click="handleUpdateProgress"
                    :size="buttonSize"
                    variant="outline"
                    title="Update Current Book Progress"
                    style="width: 100%"
                >
                    <span>
                        <Icon name="mdi:book-open-page-variant" />
                        update
                    </span>
                </BaseButton>
                <BaseButton
                    @click="handleFinishReading"
                    :size="buttonSize"
                    variant="secondary"
                    title="Finish Reading"
                    style="width: 100%"
                >
                    <span>
                        <Icon name="mdi:book-open-page-variant" />
                        finished
                    </span>
                </BaseButton>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import ProgressBar from "@/components/ui/ProgressBar.vue";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
const { user } = useUserStore();

const props = defineProps<{
    totalPages: number;
}>();

const handleUpdateProgress = () => {
    console.log("update progress");
};

const handleFinishReading = () => {
    console.log("finish reading");
};

// TODO: save screen size to state/pinia store on App.vue mount
const buttonSize = computed(() => {
    return window.innerWidth < 768 ? "small" : "medium";
});

const userPageNumber = computed(() => {
    return Math.round(props.totalPages * (user.currentBookProgress / 100));
});
</script>

<style scoped>
.user-content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    gap: 2rem;
    padding: 0.5rem;
}

h3 {
    font-size: 1.5rem;
}

h4 {
    font-size: 1.25rem;
}

.progress-bar {
    width: 100%;
    height: 1rem;
    background-color: var(--surface-color);
    border-radius: 0.5rem;
}

.progress-bar-fill {
    height: 100%;
    background-color: var(--accent-blue);
    border-radius: 0.5rem;
}

.user-progress {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}
.progress-info {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
}

.progress-percentage {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-blue);
}

.progress-page-info {
    font-size: 1.25rem;
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
    .user-content {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        gap: 3rem;
    }
    h3 {
        font-size: 1.75rem;
    }
    h4 {
        font-size: 1.5rem;
    }
    .progress-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        gap: 1rem;
    }
}
</style>
