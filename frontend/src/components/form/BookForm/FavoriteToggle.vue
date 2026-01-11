<template>
    <div
        class="favorite-toggle-container"
        :class="{ 'is-favorited': isFavorited, 'just-toggled': justToggled }"
        @click="handleToggle"
    >
        <div class="label-wrapper">
            <label class="favorite-label"> favorite </label>
            <transition name="icon-swap" mode="out-in">
                <FontAwesomeIcon
                    :key="isFavorited ? 'check' : 'question'"
                    :icon="icon"
                    class="heart-icon"
                />
            </transition>
        </div>
        <IconButton
            :icon="isFavorited ? faHeartSolid : faHeartRegular"
            :size="buttonSize"
            color="pink"
            shadowColor="pink"
            :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
            :handleClick="handleToggle"
            :class="{ 'button-favorited': isFavorited }"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import {
    faCheck,
    faHeart as faHeartSolid,
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const { isFavorited } = defineProps<{
    isFavorited: boolean;
}>();

const { mobile } = useDisplay();

const buttonSize = computed(() => (mobile.value ? "xsmall" : "small"));
const icon = computed(() => (isFavorited ? faCheck : faQuestion));

const justToggled = ref(false);

const emit = defineEmits<{
    (e: "toggle"): void;
}>();

const handleToggle = () => {
    emit("toggle");

    // Trigger animation
    justToggled.value = true;
    setTimeout(() => {
        justToggled.value = false;
    }, 600);
};

// Watch for external changes to isFavorited (e.g., form reset)
watch(
    () => isFavorited,
    () => {
        justToggled.value = true;
        setTimeout(() => {
            justToggled.value = false;
        }, 600);
    }
);
</script>

<style scoped>
.favorite-toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border: 2px solid var(--accent-pink);
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--accent-pink) 3%, transparent);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    gap: 1rem;
}

.favorite-toggle-container:hover {
    background: color-mix(in srgb, var(--accent-pink) 6%, transparent);
}

.favorite-toggle-container.just-toggled {
    animation: containerPulse 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.favorite-toggle-container.is-favorited {
    background: color-mix(in srgb, var(--accent-pink) 8%, transparent);
    border-color: var(--accent-pink);
}

.label-wrapper {
    display: flex;
    align-items: baseline;
    color: var(--accent-pink);
    gap: 0;
}

.favorite-label {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    color: var(--accent-pink);
    font-family: "Libre Baskerville", serif;
    cursor: pointer;
    transition: color 0.3s ease;
}

.favorite-toggle-container.is-favorited .favorite-label {
    color: var(--accent-pink);
    font-weight: 600;
}

.heart-icon {
    font-size: 1rem;
    transition: color 0.3s ease;
}

.button-favorited {
    animation: heartBounce 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Icon swap transition */
.icon-swap-enter-active,
.icon-swap-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-swap-enter-from {
    opacity: 0;
    transform: scale(0.5) rotate(-90deg);
}

.icon-swap-leave-to {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
}

.icon-swap-enter-to,
.icon-swap-leave-from {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}

/* Container pulse animation */
@keyframes containerPulse {
    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 rgba(255, 110, 199, 0);
    }
    50% {
        transform: scale(1.03);
        box-shadow: 0 0 20px rgba(255, 110, 199, 0.3);
    }
}

/* Heart bounce animation */
@keyframes heartBounce {
    0%,
    100% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.25);
    }
    50% {
        transform: scale(0.95);
    }
    75% {
        transform: scale(1.15);
    }
}

@media (max-width: 768px) {
    .favorite-toggle-container {
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border-width: 1.5px;
    }
    .favorite-label {
        font-size: 0.95rem;
    }
}
</style>
