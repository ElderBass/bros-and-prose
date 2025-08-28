<template>
    <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: `${progress}%` }"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    progress: number;
}>();
</script>

<style scoped>
.progress-bar {
    width: 100%;
    height: 1rem;
    background-color: var(--slate-gray);
    border: 1px solid var(--accent-fuschia);
    border-radius: 0.5rem;
}

.progress-bar-fill {
    height: 100%;
    background-color: var(--accent-blue);
    border-radius: 0.5rem;
}
</style>
