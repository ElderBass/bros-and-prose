<template>
    <button
        class="base-button"
        :disabled="disabled"
        :type="type"
        :size="size"
        :variant="variant"
        :title="title"
        :style="style"
        @click="$emit('click', $event)"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "outline"
    | "outline-secondary";

withDefaults(
    defineProps<{
        title?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        size?: "small" | "medium" | "large";
        variant?: ButtonVariant;
        style?: CSSProperties;
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
    color: var(--background-color);
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
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

.base-button[variant="outline"] {
    background-color: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
}

.base-button[variant="outline"]:hover {
    background-color: var(--accent-blue);
    color: var(--background-color);
}

.base-button[variant="outline"]:disabled {
    background-color: transparent;
    border: 2px solid var(--slate-gray);
    color: var(--slate-gray);
    opacity: 0.75;
}

.base-button[variant="outline-secondary"] {
    background-color: transparent;
    border: 2px solid var(--accent-fuschia);
    color: var(--accent-fuschia);
}

.base-button[variant="outline-secondary"]:hover {
    background-color: var(--accent-fuschia);
    color: var(--background-color);
}

.base-button[variant="outline-secondary"]:disabled {
    background-color: transparent;
    border: 2px solid var(--slate-gray);
    color: var(--slate-gray);
    opacity: 0.75;
}

.base-button[variant="secondary"] {
    background-color: var(--accent-fuschia);
}

.base-button[variant="secondary"]:hover {
    background-color: var(--accent-blue);
}

.base-button[variant="success"] {
    background-color: var(--accent-green);
}

.base-button[variant="success"]:hover {
    background-color: var(--accent-lavender);
}

/* Size variants */
.base-button[size="small"] {
    padding: 0.5rem 0.75rem;
    font-size: 1.125rem;
    min-height: 2rem;
}

.base-button[size="medium"] {
    padding: 0.75rem 1.25rem;
    font-size: 1.5rem;
    min-height: 3rem;
}

.base-button[size="large"] {
    padding: 1rem 1.5rem;
    font-size: 1.75rem;
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
