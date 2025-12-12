<template>
    <v-tooltip
        v-model="isVisible"
        :location="location"
        :open-delay="openDelay"
        :close-delay="closeDelay"
        :offset="offset"
        :class="`tooltip-shadow-${shadowColor}`"
        content-class="base-tooltip-content"
        :max-width="maxWidth"
    >
        <template #activator="{ props: activatorProps }">
            <div
                v-bind="activatorProps"
                class="tooltip-activator-wrapper"
                @click="handleActivatorClick"
                @touchstart="handleTouchStart"
                :style="maxWidth ? { width: maxWidth } : {}"
            >
                <slot name="activator" :props="activatorProps" />
            </div>
        </template>

        <div class="base-tooltip-wrapper">
            {{ text }}
            <slot />
        </div>
    </v-tooltip>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

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

const props = withDefaults(
    defineProps<{
        text?: string;
        modelValue?: boolean;
        location?: TooltipLocation;
        openDelay?: number;
        closeDelay?: number;
        offset?: number;
        maxWidth?: number | string;
        shadowColor?: ShadowColor;
        dismissOnClick?: boolean;
    }>(),
    {
        location: "top",
        openDelay: 200,
        closeDelay: 100,
        offset: 8,
        maxWidth: 300,
        shadowColor: "lavender",
        dismissOnClick: true,
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const isVisible = ref(props.modelValue ?? false);

// Sync with external modelValue changes
watch(
    () => props.modelValue,
    (newVal) => {
        isVisible.value = newVal ?? false;
    }
);

// Emit changes back to parent
watch(isVisible, (newVal) => {
    emit("update:modelValue", newVal);
});

// Handle click/touch events to dismiss tooltip on mobile
const handleActivatorClick = () => {
    if (props.dismissOnClick && isVisible.value) {
        // Small delay to allow click event to propagate first
        setTimeout(() => {
            isVisible.value = false;
        }, 50);
    }
};

const handleTouchStart = () => {
    // On touch devices, dismiss tooltip after a short delay
    // This handles the case where tooltip opens on touch but user wants to interact
    if (props.dismissOnClick && isVisible.value) {
        setTimeout(() => {
            isVisible.value = false;
        }, 300);
    }
};
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
.tooltip-activator-wrapper {
    display: inline-block;
}

.base-tooltip-wrapper {
    max-width: 100%;
    word-wrap: break-word;
}
</style>
