<template>
    <div
        @click="handleClick"
        class="base-card"
        :class="[
            `shadow-${shadowColor}`,
            `size-${size}`,
            { 'is-hoverable': hoverable },
        ]"
        :style="style"
    >
        <div class="card-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

withDefaults(
    defineProps<{
        shadowColor?: "blue" | "lavender" | "green" | "fuschia";
        size?: "small" | "medium" | "large";
        hoverable?: boolean;
        handleClick?: () => void;
        style?: CSSProperties;
    }>(),
    {
        shadowColor: "blue",
        size: "medium",
        hoverable: false,
        handleClick: () => {},
    }
);
</script>

<style scoped>
.base-card {
    background-color: var(--surface-color);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    width: 100%;
}

/* Add subtle gradient overlay for depth */
.base-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
    );
    pointer-events: none;
}

.card-content {
    padding: 1.5rem;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    width: 100%;
}

/* Size variants */
.size-large .card-content {
    padding: 2rem;
}

.size-medium .card-content {
    padding: 1.5rem;
}

.size-small .card-content {
    padding: 1rem;
}

/* Shadow color variants */
.shadow-blue {
    box-shadow:
        0 4px 10px var(--accent-blue),
        0 0 20px var(--accent-blue),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.shadow-lavender {
    box-shadow:
        0 4px 10px var(--accent-lavender),
        0 0 20px var(--accent-lavender),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.shadow-green {
    box-shadow:
        0 4px 10px var(--accent-green),
        0 0 20px var(--accent-green),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.shadow-fuschia {
    /* box-shadow:
        0 4px 20px rgba(255, 77, 255, 0.15),
        0 0 40px rgba(255, 77, 255, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.1); */
    box-shadow:
        0 4px 10px var(--accent-fuschia),
        0 0 20px var(--accent-fuschia),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Hover effects for hoverable cards */
.is-hoverable {
    cursor: pointer;
    transform: translateY(0);
}

.is-hoverable:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-blue:hover {
    box-shadow:
        0 8px 32px rgba(0, 191, 255, 0.25),
        0 0 60px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-lavender:hover {
    box-shadow:
        0 8px 32px rgba(179, 136, 255, 0.25),
        0 0 60px rgba(179, 136, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-green:hover {
    box-shadow:
        0 8px 32px rgba(57, 255, 20, 0.25),
        0 0 60px rgba(57, 255, 20, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-fuschia:hover {
    box-shadow:
        0 8px 32px rgba(255, 77, 255, 0.25),
        0 0 60px rgba(255, 77, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-red:hover {
    box-shadow:
        0 8px 32px rgba(255, 0, 0, 0.25),
        0 0 60px rgba(255, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.is-hoverable.shadow-gray:hover {
    box-shadow:
        0 8px 32px rgba(128, 128, 128, 0.25),
        0 0 60px rgba(128, 128, 128, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .size-large .card-content {
        padding: 1.5rem;
    }

    .size-medium .card-content {
        padding: 1.25rem;
    }
}
</style>
