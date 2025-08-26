<template>
    <div class="app-layout">
        <Header />
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import Header from "./Header.vue";
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
