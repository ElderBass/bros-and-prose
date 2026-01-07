<template>
    <Transition name="alert" appear>
        <div
            v-if="alert.show"
            role="alert"
            :aria-live="alert.type === 'error' ? 'assertive' : 'polite'"
            :class="[
                'base-alert',
                `alert-${alert.type}`,
                `alert-shadow-${alertProperties.color}`,
            ]"
        >
            <div class="alert-icon">
                <FontAwesomeIcon :icon="alertProperties.icon" />
            </div>

            <div class="alert-content">
                <div class="alert-header" v-if="alertProperties.title">
                    <h4
                        :style="`color: var(--accent-${alertProperties.color})`"
                        class="alert-title"
                    >
                        {{ alertProperties.title }}
                    </h4>
                </div>
                <div class="alert-text">
                    <p v-for="message in alert.messages" :key="message">
                        {{ message }}
                    </p>
                </div>
            </div>

            <button
                v-if="alert.dismissable"
                class="alert-close"
                @click="dismissAlert"
                aria-label="Close alert"
                title="Close alert"
            >
                <FontAwesomeIcon :icon="faXmark" />
            </button>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUIStore } from "@/stores/ui";
import {
    faBookOpen,
    faGlasses,
    faHandPeace,
    faHandMiddleFinger,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { AlertProperties } from "@/types";

const { alert } = storeToRefs(useUIStore());
const { dismissAlert } = useUIStore();

// Map alert types to properties
const alertProperties = computed((): AlertProperties => {
    switch (alert.value.type) {
        case "success":
            return {
                color: "green",
                icon: faHandPeace,
                title: "esketit",
            };
        case "error":
            return {
                color: "red",
                icon: faHandMiddleFinger,
                title: "yo, wtf",
            };
        case "warning":
            return {
                color: "lavender",
                icon: faGlasses,
                title: "hol' up",
            };
        case "info":
            return {
                color: "fuschia",
                icon: faBookOpen,
                title: "fyi",
            };
        default:
            return {
                color: "blue",
                icon: faHandMiddleFinger,
                title: "ayyy lmao",
            };
    }
});
</script>

<style scoped>
/* Base alert container */
.base-alert {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    font-family: "Crimson Text", serif;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;
    background-color: var(--surface-color);
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
    border: 2px solid;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 3000;
    width: 100%;
    max-width: 400px;
    min-width: 300px;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Alert icon */
.alert-icon {
    flex-shrink: 0;
    font-size: 1.25rem;
    margin-top: 0.125rem;
}

/* Alert content */
.alert-content {
    flex: 1;
    min-width: 0;
}

.alert-header {
    margin-bottom: 0.5rem;
}

.alert-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--main-text);
}

.alert-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: var(--main-text);
    word-wrap: break-word;
    font-size: 1rem;
}

/* Close button */
.alert-close {
    flex-shrink: 0;
    background: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin-top: -0.125rem;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-close:hover {
    opacity: 1;
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
}

/* Alert type variants */
.alert-success {
    border-color: var(--accent-green);
}

.alert-error {
    border-color: var(--accent-red);
}

.alert-warning {
    border-color: var(--accent-lavender);
}

.alert-info {
    border-color: var(--accent-fuschia);
}

/* Shadow variants */
.alert-shadow-blue {
    box-shadow:
        0 4px 16px var(--accent-blue),
        0 0 24px rgba(0, 191, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--accent-blue);
}

.alert-shadow-blue .alert-icon {
    color: var(--accent-blue);
}

.alert-shadow-lavender {
    box-shadow:
        0 4px 16px var(--accent-lavender),
        0 0 24px rgba(179, 136, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--accent-lavender);
}

.alert-shadow-lavender .alert-icon {
    color: var(--accent-lavender);
}

.alert-shadow-green {
    box-shadow:
        0 4px 16px var(--accent-green),
        0 0 24px rgba(57, 255, 20, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--accent-green);
}

.alert-shadow-green .alert-icon {
    color: var(--accent-green);
}

.alert-shadow-fuschia {
    box-shadow:
        0 4px 16px var(--accent-fuschia),
        0 0 24px rgba(255, 77, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--accent-fuschia);
}

.alert-shadow-fuschia .alert-icon {
    color: var(--accent-fuschia);
}

.alert-shadow-red {
    box-shadow:
        0 4px 16px var(--accent-red),
        0 0 24px rgba(255, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: var(--accent-red);
}

.alert-shadow-red .alert-icon {
    color: var(--accent-red);
}

/* Add subtle gradient overlay for depth - matching BaseCard */
.base-alert::before {
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
    z-index: 1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .base-alert {
        font-size: 0.875rem;
        padding: 0.875rem 1rem;
        right: 1rem;
        bottom: 1rem;
        max-width: calc(100vw - 2rem);
        min-width: 280px;
    }

    .alert-title {
        font-size: 1rem;
    }

    .alert-icon {
        font-size: 1.125rem;
    }
}

@media (max-width: 480px) {
    .base-alert {
        padding: 0.75rem;
        gap: 0.75rem;
        min-width: 260px;
    }
}
/* Vue transitions */
.alert-enter-active,
.alert-leave-active {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.alert-enter-from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
}

.alert-enter-to {
    opacity: 1;
    transform: translateX(0) scale(1);
}

.alert-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
}

.alert-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.98);
}
</style>
