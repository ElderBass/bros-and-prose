<template>
    <button
        class="base-button"
        :disabled="disabled"
        :type="type"
        :size="size"
        :variant="variant"
        :title="title"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        size?: "small" | "medium" | "large";
        variant?: "primary" | "secondary" | "tertiary";
    }>(),
    {
        title: "some dumb shitty button",
        disabled: false,
        type: "button",
        size: "medium",
        variant: "primary",
    }
);

defineEmits<{
    click: [event: MouseEvent];
}>();
</script>

<style scoped>
.base-button {
    color: var(--surface-color);
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
    border: none;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

/* Primary variant - blue to fuschia */
.base-button[variant="primary"] {
    background-color: var(--accent-blue);
}

.base-button[variant="primary"]:hover {
    background-color: var(--accent-fuschia);
}

/* Secondary variant - fuschia to blue */
.base-button[variant="secondary"] {
    background-color: var(--accent-fuschia);
}

.base-button[variant="secondary"]:hover {
    background-color: var(--accent-blue);
}

/* Tertiary variant - green to lavender */
.base-button[variant="tertiary"] {
    background-color: var(--accent-green);
}

.base-button[variant="tertiary"]:hover {
    background-color: var(--accent-lavender);
}

/* Size variants */
.base-button[size="small"] {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    min-height: 2rem;
}

.base-button[size="medium"] {
    padding: 0.75rem 1.25rem;
    font-size: 1.125rem;
    border-radius: 1rem;
    min-height: 3rem;
}

.base-button[size="large"] {
    padding: 1rem 1.5rem;
    font-size: 1.5rem;
    border-radius: 1.25rem;
    min-height: 4rem;
}

/* Disabled state for all variants */
.base-button:disabled {
    background-color: var(--surface-color);
    color: var(--main-text);
    opacity: 0.75;
    cursor: not-allowed;
}

.base-button:disabled:hover {
    background-color: var(--surface-color);
}
</style>
