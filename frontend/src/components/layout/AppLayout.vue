<template>
    <div class="app-layout">
        <AppHeader />
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding: 1rem;
}

@media (min-width: 768px) {
    .main-content {
        padding: 1.5rem;
    }
}
</style>
