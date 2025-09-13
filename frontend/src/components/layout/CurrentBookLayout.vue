<template>
    <div class="current-book-layout">
        <h1>current prose ferda bros</h1>
        <div v-if="isMobile" class="layout-column">
            <slot name="current-book" />
            <slot name="user-progress" />
            <slot name="other-bros-progress" />
        </div>
        <div v-else class="layout-row">
            <div class="layout-column">
                <slot name="current-book" />
                <slot name="other-bros-progress" />
            </div>
            <slot name="user-progress" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const isMobile = computed(() => {
    return window.innerWidth < 768;
});
</script>

<style scoped>
.current-book-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 2rem;
}

h1 {
    font-size: 1.5rem;
    color: var(--main-text);
    border-bottom: 2px solid var(--accent-blue);
    font-weight: 600;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 0.25rem;
}

.layout-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 2rem;
}

.layout-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .current-book-container {
        gap: 3rem;
    }
    h1 {
        font-size: 1.75rem;
    }
}
</style>
