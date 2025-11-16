<template>
    <Teleport to="body">
        <Transition name="modal" appear>
            <div
                v-if="modelValue"
                class="modal-backdrop"
                @click="handleBackdropClick"
            >
                <div
                    class="modal-container"
                    :class="`size-${size} shadow-${shadowColor}`"
                    @click.stop
                >
                    <div class="modal-header" v-if="title || !hideCloseButton">
                        <h3 v-if="title && !headerIcon" class="modal-title">
                            {{ title }}
                        </h3>
                        <div
                            v-else-if="headerIcon && title"
                            class="icon-header"
                            :class="`icon-header-${shadowColor}`"
                        >
                            <FontAwesomeIcon :icon="headerIcon" />
                            <h3 class="modal-title modal-title-icon">
                                {{ title }}
                            </h3>
                        </div>
                        <button
                            v-if="!hideCloseButton"
                            class="modal-close-button"
                            @click="closeModal"
                            :title="closeButtonTitle"
                        >
                            <FontAwesomeIcon :icon="faXmark" size="lg" />
                        </button>
                    </div>

                    <div class="modal-content">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="modal-footer">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        title?: string;
        size?: "small" | "medium" | "large";
        shadowColor?: "lavender" | "fuschia" | "green" | "blue" | "red";
        hideCloseButton?: boolean;
        closeOnBackdrop?: boolean;
        closeButtonTitle?: string;
        headerIcon?: IconDefinition;
    }>(),
    {
        size: "medium",
        shadowColor: "lavender",
        hideCloseButton: false,
        closeOnBackdrop: true,
        closeButtonTitle: "Close modal",
    }
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
    close: [];
}>();

const closeModal = () => {
    emit("update:modelValue", false);
    emit("close");
};

const handleBackdropClick = () => {
    if (props.closeOnBackdrop) {
        closeModal();
    }
};
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-container {
    background-color: var(--surface-color);
    border: 2px solid var(--accent-blue);
    padding: 1.5rem;
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 90vh;
    max-width: 90vw;
    display: flex;
    flex-direction: column;
}

.modal-container.shadow-lavender {
    border: 2px solid var(--accent-lavender);
    box-shadow:
        0 8px 32px var(--accent-lavender),
        0 0 60px var(--accent-lavender),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.shadow-fuschia {
    border: 2px solid var(--accent-fuschia);
    box-shadow:
        0 8px 32px var(--accent-fuschia),
        0 0 60px var(--accent-fuschia),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.shadow-green {
    border: 2px solid var(--accent-green);
    box-shadow:
        0 8px 32px var(--accent-green),
        0 0 60px var(--accent-green),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.shadow-blue {
    border: 2px solid var(--accent-blue);
    box-shadow:
        0 8px 32px var(--accent-blue),
        0 0 60px var(--accent-blue),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-container.shadow-red {
    border: 2px solid var(--accent-red);
    box-shadow:
        0 8px 32px var(--accent-red),
        0 0 60px var(--accent-red),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
/* Add subtle gradient overlay for depth - matching BaseCard */
.modal-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent,
        var(--accent-lavender),
        transparent
    );
    pointer-events: none;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.5rem;
    position: relative;
    z-index: 1;
}

.icon-header {
    display: flex;
    align-items: center;
    font-size: 1.75rem;
    gap: 0.5rem;
}

.icon-header-lavender {
    color: var(--accent-lavender);
}

.icon-header-fuschia {
    color: var(--accent-fuschia);
}

.icon-header-green {
    color: var(--accent-green);
}

.icon-header-blue {
    color: var(--accent-blue);
}

.icon-header-red {
    color: var(--accent-red);
}

.modal-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.5rem;
    color: var(--main-text);
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 0.25rem;
    margin: 0;
    font-weight: 400;
}

.modal-title-icon {
    border-bottom: none;
    color: inherit;
}

.modal-close-button {
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

.modal-close-button:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    transform: scale(1.1);
    border-color: var(--accent-fuschia);
}

.modal-close-button:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.modal-content {
    flex: 1;
    /* Allow native selects to render dropdowns correctly on iOS within modals */
    overflow: visible;
    position: relative;
    z-index: 1;
}

.modal-footer {
    margin-top: 1.5rem;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
}

/* Size variants */
.modal-container.size-small {
    width: 100%;
    max-width: 400px;
}

.modal-container.size-medium {
    width: 100%;
    max-width: 600px;
}

.modal-container.size-large {
    width: 100%;
    max-width: 900px;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
    opacity: 1;
}

.modal-enter-to .modal-container,
.modal-leave-from .modal-container {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .modal-backdrop {
        padding: 0.5rem;
    }

    .modal-container {
        max-height: 95vh;
        max-width: 95vw;
    }

    .modal-header {
        padding-bottom: 1rem;
    }

    .modal-footer {
        padding: 1rem;
        margin-top: 1rem;
    }

    .modal-title {
        font-size: 1.25rem;
    }

    .modal-close-button {
        font-size: 0.75rem;
        width: 1.75rem;
        height: 1.75rem;
    }
}

/* Prevent body scroll when modal is open */
.modal-backdrop {
    overscroll-behavior: contain;
}
</style>
