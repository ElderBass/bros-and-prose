<template>
    <button class="composer-tool-button" :title="title" @click="emit('click')">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>

<style scoped>
.composer-tool-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 2px solid var(--accent-lavender);
    color: var(--accent-lavender);
    transition: all 0.3s ease;
    &:hover {
        background-color: var(--accent-lavender);
        color: var(--background-color);
        border-color: var(--accent-blue);
    }
    &:active {
        transform: scale(0.95);
    }
}

@media (max-width: 768px) {
    .composer-tool-button {
        width: 1.75rem;
        height: 1.75rem;
        padding: 0.25rem;
        font-size: 0.75rem;
    }
}
</style>
