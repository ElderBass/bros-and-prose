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
                :title="title"
                @click="handleClick"
            >
                <FontAwesomeIcon :icon="icon" />
            </button>
        </template>
    </BaseTooltip>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

withDefaults(
    defineProps<{
        icon: IconDefinition;
        size: "xsmall" | "small" | "medium" | "large";
        title: string;
        shadowColor?: "lavender" | "fuschia" | "green" | "blue";
        disabled?: boolean;
        handleClick: () => void;
    }>(),
    {
        shadowColor: "fuschia",
        disabled: false,
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

.icon-button:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    transform: scale(1.1);
    border-color: var(--accent-fuschia);
}

.icon-button:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.icon-button.size-xsmall {
    width: 1.5rem;
    height: 1.5rem;
}

.icon-button.size-small {
    width: 2rem;
    height: 2rem;
}

.icon-button.size-medium {
    width: 3rem;
    height: 3rem;
}

.icon-button.size-large {
    width: 4rem;
    height: 4rem;
}
</style>
