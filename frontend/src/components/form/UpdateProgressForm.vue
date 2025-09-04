<template>
    <BaseCard shadowColor="lavender" size="medium">
        <div class="update-progress-form">
            <h2 class="form-title">update yer prog</h2>
            <div class="input-mode-toggle">
                <BaseButton
                    :variant="inputMode === 'pages' ? 'tertiary' : 'outline'"
                    size="small"
                    @click="inputMode = 'pages'"
                    style="width: 100%"
                >
                    page #
                </BaseButton>
                <BaseButton
                    :variant="
                        inputMode === 'percentage' ? 'tertiary' : 'outline'
                    "
                    size="small"
                    @click="inputMode = 'percentage'"
                    style="width: 100%"
                >
                    % complete
                </BaseButton>
            </div>

            <div class="input-section">
                <div class="input-group">
                    <BaseInput
                        v-model="inputValue"
                        :label="
                            inputMode === 'pages'
                                ? 'Current page'
                                : 'Percentage complete'
                        "
                        :placeholder="
                            inputMode === 'pages'
                                ? 'Enter page number'
                                : 'Enter percentage'
                        "
                        type="number"
                        :disabled="false"
                        :prepend-inner-icon="''"
                        size="medium"
                    />
                    <div class="input-info">
                        <span v-if="inputMode === 'pages'" class="helper-text">
                            of {{ totalPages }} total pages
                        </span>
                        <span v-else class="helper-text">
                            {{ progressPercentage }}% complete
                        </span>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <BaseButton
                    variant="outline-secondary"
                    size="medium"
                    @click="$emit('cancel')"
                    style="width: 100%"
                >
                    Cancel
                </BaseButton>
                <BaseButton
                    variant="primary"
                    size="medium"
                    :disabled="!isValidInput"
                    @click="handleSubmit"
                    style="width: 100%"
                >
                    Update
                </BaseButton>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
    totalPages: number;
    currentProgress: number; // Current page number
}>();

const emit = defineEmits<{
    updateProgress: [pageNumber: number];
    cancel: [];
}>();

const inputMode = ref<"pages" | "percentage">("pages");
const inputValue = ref<string>(props.currentProgress.toString());

// Convert between pages and percentage
const progressPercentage = computed(() => {
    if (inputMode.value === "pages") {
        const pages = parseInt(inputValue.value) || 0;
        return Math.min((pages / props.totalPages) * 100, 100);
    } else {
        return Math.min(parseInt(inputValue.value) || 0, 100);
    }
});

const calculatedPages = computed(() => {
    if (inputMode.value === "percentage") {
        const percentage = parseInt(inputValue.value) || 0;
        return Math.round((percentage / 100) * props.totalPages);
    }
    return parseInt(inputValue.value) || 0;
});

const isValidInput = computed(() => {
    const value = parseInt(inputValue.value);
    if (isNaN(value) || value < 0) return false;

    if (inputMode.value === "pages") {
        return value <= props.totalPages;
    } else {
        return value <= 100;
    }
});

const handleSubmit = () => {
    if (!isValidInput.value) return;

    const pageNumber =
        inputMode.value === "pages"
            ? parseInt(inputValue.value)
            : calculatedPages.value;

    emit("updateProgress", pageNumber);
};

onMounted(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>

<style scoped>
.update-progress-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}

.form-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.5rem;
    color: var(--main-text);
    text-align: center;
    margin: 0;
    border-bottom: 2px solid var(--accent-lavender);
    padding-bottom: 0.5rem;
}

.input-mode-toggle {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: center;
}

.input-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-info {
    display: flex;
    justify-content: center;
}

.helper-text {
    font-size: 1.25rem;
    color: var(--main-text);
    opacity: 0.7;
    text-align: center;
}

.progress-display {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--surface-color);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--accent-lavender);
}

.progress-fill {
    height: 100%;
    background: linear-gradient(
        90deg,
        var(--accent-blue),
        var(--accent-lavender)
    );
    transition: width 0.3s ease;
    border-radius: 3px;
}

.progress-text {
    font-size: 0.875rem;
    color: var(--accent-lavender);
    font-weight: 600;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-top: 0.5rem;
}

@media (max-width: 480px) {
    .update-progress-form {
        max-width: 100%;
    }

    /* .form-actions {
        flex-direction: column;
        gap: 0.75rem;
    } */

    /* .input-mode-toggle {
        flex-direction: column;
        align-items: stretch;
    } */
}
</style>
