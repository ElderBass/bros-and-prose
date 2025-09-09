<template>
    <div class="progress-slider-input">
        <FontAwesomeIcon :icon="faBookBookmark" class="progress-slider-icon" />
        <v-slider
            :model-value="progress"
            :max="maxPages"
            @update:model-value="emit('progressChange', $event)"
            color="#ff4dff"
            thumb-color="#00bfff"
            thumb-size="24"
            :readonly="props.disabled"
            height="24"
            track-size="12"
        />
    </div>
</template>

<script setup lang="ts">
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";

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
    gap: 0.5rem;
}
.progress-slider-icon {
    padding-top: 0.35rem;
    font-size: 1.5rem;
    color: var(--accent-lavender);
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
}
</style>
