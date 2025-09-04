<template>
    <div class="progress-slider-input">
        <v-slider
            :model-value="progress"
            :max="100"
            @update:model-value="emit('progressChange', $event)"
            color="#ff4dff"
            thumb-color="#00bfff"
            thumb-size="24"
            :disabled="props.disabled"
            height="24"
            track-size="12"
        />
        <p>{{ maxPages }}</p>
    </div>
</template>

<script setup lang="ts">
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
    gap: 1rem;
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
