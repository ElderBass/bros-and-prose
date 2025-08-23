<template>
    <div class="loading-spinner" :class="{ [`size-${size}`]: size }">
        <p v-if="message" class="loading-message">{{ message }}</p>
        <div class="spinner"></div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: "small" | "medium" | "large";
        message?: string;
    }>(),
    {
        size: "medium",
        message: "",
    }
);
</script>

<style scoped>
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
}

.spinner {
    border: 4px solid var(--surface-color);
    border-top: 4px solid var(--accent-blue);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Size variants */
.size-small .spinner {
    width: 30px;
    height: 30px;
    border-width: 3px;
}

.size-medium .spinner {
    width: 50px;
    height: 50px;
    border-width: 4px;
}

.size-large .spinner {
    width: 80px;
    height: 80px;
    border-width: 6px;
}

.loading-message {
    color: var(--main-text);
    font-family: "Crimson Text", serif;
    font-size: 1.25rem;
    margin: 0;
    text-align: center;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Neon glow effect */
.spinner {
    box-shadow: 0 0 10px var(--accent-blue);
}
</style>
