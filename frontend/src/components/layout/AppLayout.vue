<template>
    <div class="app-layout">
        <AppHeader />
        <main class="main-content">
            <ViewContainer>
                <slot />
            </ViewContainer>
            <BaseAlert v-model="alert" />
        </main>
    </div>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import ViewContainer from "./ViewContainer.vue";

const { alert } = storeToRefs(useUIStore());
</script>

<style scoped>
.app-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding: 1rem;
    padding-top: 0.25rem;
    position: relative;
}

@media (min-width: 768px) {
    .main-content {
        padding: 1.5rem;
        padding-top: 0.5rem;
    }
}
</style>
