<template>
    <BaseTooltip
        v-if="showTooltip"
        :text="title.toLowerCase().trim()"
        :shadow-color="tooltipShadowColor"
        :open-delay="750"
        :max-width="props.style?.width"
    >
        <template #activator="{ props: tooltipProps }">
            <button
                v-bind="tooltipProps"
                class="base-button"
                :disabled="disabled"
                :type="type"
                :size="size"
                :variant="variant"
                :style="style"
                @click="$emit('click', $event)"
            >
                <slot></slot>
            </button>
        </template>
    </BaseTooltip>

    <button
        v-else
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
import { computed } from "vue";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "error"
    | "outline"
    | "outline-secondary"
    | "outline-tertiary"
    | "outline-success"
    | "outline-error";

type TooltipShadowColor = "lavender" | "fuschia" | "green" | "blue" | "red";

const props = withDefaults(
    defineProps<{
        title?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        size?: "xsmall" | "small" | "medium" | "large";
        variant?: ButtonVariant;
        style?: CSSProperties;
        showTooltip?: boolean;
        tooltipStyle?: CSSProperties;
    }>(),
    {
        title: "some dumb shitty button",
        disabled: false,
        type: "button",
        size: "medium",
        variant: "primary",
        showTooltip: true,
    }
);

defineEmits<{
    click: [event: MouseEvent];
}>();

// Map button variants to tooltip shadow colors
const tooltipShadowColor = computed((): TooltipShadowColor => {
    switch (props.variant) {
        case "primary":
        case "outline":
            return "blue";
        case "secondary":
        case "outline-secondary":
            return "fuschia";
        case "tertiary":
            return "lavender";
        case "success":
        case "outline-success":
            return "green";
        case "error":
        case "outline-error":
            return "red";
        case "outline-tertiary":
            return "lavender";
        default:
            return "blue";
    }
});

// Only show tooltip if title is meaningful and showTooltip is true
const showTooltip = computed(() => {
    return (
        props.showTooltip &&
        props.title !== "some dumb shitty button" &&
        props.title.trim().length > 0
    );
});
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

/* Primary variant - blue to fuschia */
.base-button[variant="primary"] {
    background-color: var(--accent-blue);
    border: 2px solid var(--accent-blue);
}

.base-button[variant="primary"]:hover {
    background-color: var(--accent-fuschia);
    border: 2px solid var(--accent-fuschia);
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
    border: 2px solid var(--accent-fuschia);
}

.base-button[variant="secondary"]:hover {
    background-color: var(--accent-blue);
    border: 2px solid var(--accent-blue);
}

.base-button[variant="tertiary"] {
    background-color: var(--accent-lavender);
    border: 2px solid var(--accent-lavender);
}

.base-button[variant="tertiary"]:hover {
    background-color: var(--accent-blue);
    border: 2px solid var(--accent-blue);
}

.base-button[variant="success"] {
    background-color: var(--accent-green);
    border: 2px solid var(--accent-green);
}

.base-button[variant="success"]:hover {
    background-color: var(--accent-lavender);
    border: 2px solid var(--accent-lavender);
}

.base-button[variant="outline-success"] {
    background-color: transparent;
    border: 2px solid var(--accent-green);
    color: var(--accent-green);
}

.base-button[variant="outline-success"]:hover {
    background-color: var(--accent-green);
    color: var(--background-color);
}

.base-button[variant="outline-success"]:disabled {
    background-color: transparent;
    border: 2px solid var(--slate-gray);
    color: var(--slate-gray);
    opacity: 0.75;
}

.base-button[variant="outline-tertiary"] {
    background-color: transparent;
    border: 2px solid var(--accent-lavender);
    color: var(--accent-lavender);
}

.base-button[variant="outline-tertiary"]:hover {
    background-color: var(--accent-lavender);
    color: var(--background-color);
}

.base-button[variant="outline-error"] {
    background-color: transparent;
    border: 2px solid var(--accent-red);
    color: var(--accent-red);
}

.base-button[variant="outline-error"]:hover {
    background-color: var(--accent-red);
    color: var(--background-color);
}

.base-button[variant="outline-error"]:disabled {
    background-color: transparent;
    border: 2px solid var(--slate-gray);
    color: var(--slate-gray);
    opacity: 0.75;
}

.base-button[variant="error"] {
    background-color: var(--accent-red);
    border: 2px solid var(--accent-red);
}

.base-button[variant="error"]:hover {
    background-color: var(--accent-lavender);
    border: 2px solid var(--accent-lavender);
}

.base-button[variant="error"]:disabled {
    background-color: var(--accent-red);
    opacity: 0.75;
}

/* Size variants */
.base-button[size="xsmall"] {
    padding: 0.15rem 0.4rem;
    font-size: 0.85rem;
    min-height: 1.25rem;
}

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
