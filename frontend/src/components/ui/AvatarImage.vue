<template>
    <div
        class="avatar-item"
        :class="[sizeClass, { 'is-hoverable': hoverable }]"
        @click="props.onClick"
    >
        <FontAwesomeIcon :icon="icon" />
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        icon: IconDefinition;
        hoverable?: boolean;
        size?: "xsmall" | "small" | "medium" | "large" | "xlarge";
        onClick?: () => void;
    }>(),
    {
        hoverable: false,
        size: "medium",
        onClick: () => {},
    }
);

const sizeClass = computed(() => `size-${props.size}`);
</script>

<style scoped>
.avatar-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
    padding: 0.5rem;
    transition: all 0.3s ease;
    background-color: transparent;
    &.is-hoverable:hover {
        cursor: pointer;
        color: var(--background-color);
        background-color: var(--accent-blue);
    }
}

.avatar-item.size-xsmall {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1rem;
}

.avatar-item.size-small {
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
}

.avatar-item.size-medium {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
}

.avatar-item.size-large {
    width: 6rem;
    height: 6rem;
    font-size: 2.75rem;
}

.avatar-item.size-xlarge {
    width: 8rem;
    height: 8rem;
    font-size: 3.5rem;
}
</style>
