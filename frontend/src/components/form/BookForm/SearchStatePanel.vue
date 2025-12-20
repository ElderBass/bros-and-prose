<template>
    <Transition name="fade-slide" mode="out-in">
        <div v-if="loading" key="loading">
            <slot name="loading" />
        </div>

        <div v-else-if="showResults" key="results">
            <slot name="results" />
        </div>

        <div v-else-if="showEmpty" class="empty-panel" key="empty">
            <p>enter a title and we'll divine some books</p>
            <span class="hash">#godsplan</span>
        </div>

        <div v-else key="none" />
    </Transition>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        loading: boolean;
        showResults: boolean;
        showEmpty: boolean;
    }>(),
    {
        showEmpty: true,
    }
);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.empty-panel-wrapper {
    height: 100%;
}

.empty-panel {
    flex: 1;
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--main-text);
    opacity: 0.85;
    padding: 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 1rem;
    border: 2px dashed var(--accent-blue);
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.hash {
    color: var(--accent-fuschia);
}

@media (max-width: 768px) {
    .empty-panel {
        font-size: 1.125rem;
        padding: 1rem;
    }
}
</style>
