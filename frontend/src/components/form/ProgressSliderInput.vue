<template>
    <div class="progress-slider-input" :class="{ disabled: props.disabled }">
        <FontAwesomeIcon :icon="faBookOpen" class="progress-slider-icon" />
        <v-slider
            :model-value="progress"
            :max="maxPages"
            @update:model-value="emit('progressChange', $event)"
            :color="props.disabled ? '#cccccc' : '#ff4dff'"
            :thumb-color="props.disabled ? '#999999' : '#00bfff'"
            thumb-size="24"
            :readonly="props.disabled"
            height="24"
            track-size="12"
            :class="{ 'slider-disabled': props.disabled }"
        />
        <FontAwesomeIcon :icon="faBookBookmark" class="progress-slider-icon" />
    </div>
</template>

<script setup lang="ts">
import { faBookBookmark, faBookOpen } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    progress: number;
    maxPages: number;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    progressChange: [value: number];
}>();
</script>

<style scoped>
.progress-slider-input {
    width: 100%;
    display: flex;
    padding: 1rem 0;
    padding-bottom: 0.25rem;
    gap: 0.5rem;
}
.progress-slider-icon {
    padding-top: 0.35rem;
    font-size: 1.25rem;
    color: var(--accent-lavender);
    transition: all 0.3s ease;
}

.progress-slider-input.disabled .progress-slider-icon {
    color: #cccccc;
    opacity: 0.6;
}

.progress-slider-input.disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.slider-disabled {
    pointer-events: none;
}
p {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--accent-lavender);
}

@media (min-width: 768px) {
    p {
        font-size: 1.75rem;
    }
    .progress-slider-icon {
        font-size: 1.5rem;
    }
    .progress-slider-input {
        padding-bottom: 1rem;
    }
    .progress-slider-input.disabled {
        padding-bottom: 1rem;
    }
}
</style>
