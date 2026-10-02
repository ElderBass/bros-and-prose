<template>
    <button
        type="button"
        class="prose-action-btn"
        :class="{ active }"
        :style="{ '--action-color': `var(--accent-${color})` }"
        :disabled="disabled"
        :aria-pressed="active"
        :title="title"
    >
        <span class="action-icon" aria-hidden="true">
            <slot name="icon" />
        </span>
        <span class="action-label">{{ label }}</span>
        <span class="action-label-short">{{ shortLabel || label }}</span>
    </button>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        color?: "blue" | "pink" | "lavender" | "fuschia" | "green";
        label: string;
        /** Shown instead of `label` on narrow screens. */
        shortLabel?: string;
        active?: boolean;
        disabled?: boolean;
        title?: string;
    }>(),
    {
        color: "blue",
        shortLabel: "",
        active: false,
        disabled: false,
        title: undefined,
    }
);
</script>

<style scoped>
.prose-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    height: 2.4rem;
    padding: 0 1rem;
    border: 1px solid color-mix(in srgb, var(--action-color) 70%, transparent);
    border-radius: 999px;
    background: transparent;
    color: var(--action-color);
    font: inherit;
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background-color 0.15s ease,
        border-color 0.15s ease,
        transform 0.15s ease;
}

.prose-action-btn:hover:not(:disabled) {
    background: color-mix(in srgb, var(--action-color) 12%, transparent);
    border-color: var(--action-color);
}

.prose-action-btn:active:not(:disabled) {
    transform: scale(0.97);
}

.prose-action-btn:focus-visible {
    outline: 2px solid var(--action-color);
    outline-offset: 2px;
}

.prose-action-btn.active {
    background: color-mix(in srgb, var(--action-color) 22%, transparent);
    border-color: var(--action-color);
}

.prose-action-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.action-icon {
    display: inline-flex;
    align-items: center;
    font-size: 1rem;
    line-height: 1;
}

.action-label-short {
    display: none;
}

@media (max-width: 768px) {
    .prose-action-btn {
        height: 2.2rem;
        padding: 0 0.75rem;
        font-size: 0.85rem;
        gap: 0.35rem;
    }

    .action-label {
        display: none;
    }

    .action-label-short {
        display: inline;
    }
}
</style>
