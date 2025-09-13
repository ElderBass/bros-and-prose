<template>
    <v-tooltip
        :model-value="modelValue"
        :location="location"
        :disabled="disabled"
        :open-delay="openDelay"
        :close-delay="closeDelay"
        :offset="offset"
        :class="`tooltip-shadow-${shadowColor}`"
        content-class="base-tooltip-content"
        :max-width="maxWidth"
    >
        <template #activator="{ props }">
            <slot name="activator" :props="props" />
        </template>

        <div class="base-tooltip-wrapper">
            {{ text }}
            <slot />
        </div>
    </v-tooltip>
</template>

<script setup lang="ts">
type TooltipLocation =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "start"
    | "end"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";

type ShadowColor = "lavender" | "fuschia" | "green" | "blue";

withDefaults(
    defineProps<{
        text?: string;
        modelValue?: boolean;
        location?: TooltipLocation;
        disabled?: boolean;
        openDelay?: number;
        closeDelay?: number;
        offset?: number;
        maxWidth?: number | string;
        shadowColor?: ShadowColor;
    }>(),
    {
        location: "top",
        disabled: false,
        openDelay: 200,
        closeDelay: 100,
        offset: 8,
        maxWidth: 300,
        shadowColor: "lavender",
    }
);
</script>

<style>
/* Global styles for Vuetify tooltip */
.base-tooltip-content {
    background-color: var(--background-color) !important;
    border: 1px solid var(--accent-blue) !important;
    border-radius: 0.5rem !important;
    padding: 0.75rem 1rem !important;
    font-family: "Crimson Text", serif !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
    line-height: 1.4 !important;
    color: var(--main-text) !important;
    backdrop-filter: blur(10px) !important;
}

/* Shadow variants */
.tooltip-shadow-lavender .base-tooltip-content {
    box-shadow:
        0 4px 16px var(--accent-lavender),
        0 0 24px rgba(179, 136, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.tooltip-shadow-fuschia .base-tooltip-content {
    box-shadow:
        0 4px 16px var(--accent-fuschia),
        0 0 24px rgba(255, 77, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.tooltip-shadow-green .base-tooltip-content {
    box-shadow:
        0 4px 16px var(--accent-green),
        0 0 24px rgba(0, 255, 127, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.tooltip-shadow-blue .base-tooltip-content {
    box-shadow:
        0 4px 16px var(--accent-blue),
        0 0 24px rgba(0, 191, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

/* Arrow styling */
.v-overlay__content .v-tooltip__content::before {
    border-color: var(--background-color) transparent !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .base-tooltip-content {
        font-size: 0.75rem !important;
        padding: 0.5rem 0.75rem !important;
        max-width: 200px !important;
    }
}
</style>

<style scoped>
.base-tooltip-wrapper {
    max-width: 100%;
    word-wrap: break-word;
}
</style>
