<template>
    <div class="transition-container">
        <Transition name="fade" mode="out-in">
            <BaseCard
                key="progress-display"
                shadowColor="fuschia"
                size="medium"
            >
                <h3>your progress</h3>
                <CurrentUserProgress :totalPages="props.totalPages" />
            </BaseCard>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import CurrentUserProgress from "./CurrentUserProgress.vue";

const props = defineProps<{
    totalPages: number;
}>();
</script>

<style scoped>
h3 {
    font-size: 1.5rem;
    margin: 0 auto;
    padding: 0 0.25rem 0.25rem 0.25rem;
    border-bottom: 2px solid var(--accent-blue);
}

@media (min-width: 768px) {
    h3 {
        font-size: 1.75rem;
    }
}

.transition-container {
    width: 100%;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
