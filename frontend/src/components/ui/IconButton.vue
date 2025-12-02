<template>
    <BaseTooltip
        :text="title"
        :shadow-color="shadowColor"
        :open-delay="750"
        location="left"
    >
        <template #activator="{ props: tooltipProps }">
            <button
                v-bind="{ ...tooltipProps, ...$attrs }"
                class="icon-button"
                :class="[`size-${size}`, `color-${color}`]"
                :title="title"
                :style="style"
                :disabled="disabled"
                @click="(event) => handleClick(event)"
            >
                <FontAwesomeIcon :icon="icon" />
            </button>
        </template>
    </BaseTooltip>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { CSSProperties } from "vue";

withDefaults(
    defineProps<{
        icon: IconDefinition;
        size: "supersmall" | "xsmall" | "small" | "medium" | "large";
        title: string;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red";
        shadowColor?: "lavender" | "fuschia" | "green" | "blue";
        disabled?: boolean;
        style?: CSSProperties;
        handleClick: (event?: MouseEvent) => void;
        openDelay?: number;
    }>(),
    {
        color: "blue",
        shadowColor: "fuschia",
        disabled: false,
        style: () => ({}),
        openDelay: 750,
    }
);
defineOptions({ inheritAttrs: false });
</script>

<style scoped>
.icon-button {
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    padding: 0.5rem;
    color: var(--accent-blue);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
}

.icon-button.color-red {
    color: var(--accent-red);
    background-color: rgba(255, 0, 0, 0.18);
    border-color: var(--accent-red);
}

.icon-button.color-fuschia {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.15);
    border-color: var(--accent-fuschia);
}

.icon-button.color-green {
    color: var(--accent-green);
    background-color: rgba(77, 255, 77, 0.12);
    border-color: var(--accent-green);
}

.icon-button:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    transform: scale(1.1);
    border-color: var(--accent-fuschia);
    &.color-green {
        color: var(--accent-green);
        background-color: rgba(77, 255, 77, 0.1);
        border-color: var(--accent-green);
    }
    &.color-lavender {
        color: var(--accent-lavender);
        background-color: rgba(77, 77, 255, 0.1);
        border-color: var(--accent-lavender);
    }
    &.color-blue {
        color: var(--accent-blue);
        background-color: rgba(77, 77, 255, 0.1);
        border-color: var(--accent-blue);
    }
    &.color-red {
        color: #cc0000; /* darker than #ff0000 */
        background-color: rgba(204, 0, 0, 0.18);
        border-color: #cc0000;
    }
}

.icon-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.icon-button:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.icon-button.size-xsmall {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
}

.icon-button.size-supersmall {
    width: 1.2rem;
    height: 1.2rem;
    font-size: 0.6rem;
    padding: 0.25rem;
}

.icon-button.size-small {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
}

.icon-button.size-medium {
    width: 3rem;
    height: 3rem;
    font-size: 1.5rem;
}

.icon-button.size-large {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
}
</style>
