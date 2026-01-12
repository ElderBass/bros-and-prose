<template>
    <div class="step-indicator">
        <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="step"
            :class="{
                active: currentStep === index + 1,
                completed: currentStep > index + 1,
            }"
        >
            <div class="step-circle">
                <FontAwesomeIcon
                    v-if="currentStep > index + 1"
                    :icon="faCheck"
                    class="check-icon"
                />
                <span v-else class="step-number">{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step.label }}</span>
            <div v-if="index < steps.length - 1" class="step-connector"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { faCheck } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    currentStep: number;
    steps: Array<{ id: string; label: string }>;
}>();
</script>

<style scoped>
.step-indicator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    position: relative;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    position: relative;
}

.step-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid var(--main-text);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--background-color);
    transition: all 0.3s ease;
    z-index: 2;
}

.step.active .step-circle {
    border-color: var(--accent-pink);
    opacity: 1;
    box-shadow: 0 0 12px rgba(255, 110, 199, 0.6);
}

.step.completed .step-circle {
    border-color: var(--accent-green);
    background: var(--accent-green);
    opacity: 1;
}

.step-number {
    font-size: 1rem;
    font-weight: 600;
}

.step.active .step-number {
    color: var(--accent-pink);
}

.check-icon {
    color: var(--background-color);
    font-size: 1.2rem;
}

.step-label {
    font-size: 0.85rem;
    text-transform: lowercase;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.step.active .step-label {
    opacity: 1;
    color: var(--accent-pink);
    font-weight: 600;
}

.step.completed .step-label {
    opacity: 1;
    color: var(--accent-green);
}

.step-connector {
    position: absolute;
    top: 1.25rem;
    left: 50%;
    width: 100%;
    height: 2px;
    background: var(--main-text);
    opacity: 0.3;
    z-index: 1;
}

.step.completed .step-connector {
    background: var(--accent-green);
    opacity: 1;
}

@media (max-width: 768px) {
    .step-circle {
        width: 2rem;
        height: 2rem;
    }

    .step-label {
        font-size: 0.75rem;
    }

    .step-number {
        font-size: 0.85rem;
    }
}
</style>
