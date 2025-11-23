<template>
    <div class="app-layout">
        <AppHeader />
        <main class="main-content">
            <ViewContainer v-if="!isAppLoading">
                <slot />
            </ViewContainer>
            <div v-else class="spinner-container">
                <LoadingSpinner
                    size="large"
                    message="one sec, retrieving god's plan..."
                />
            </div>
            <BaseAlert v-model="alert" />
        </main>
    </div>
</template>

<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import ViewContainer from "./ViewContainer.vue";
import LoadingSpinner from "../ui/LoadingSpinner.vue";

const { alert } = storeToRefs(useUIStore());
const { isAppLoading } = storeToRefs(useUIStore());
</script>

<style scoped>
.app-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
    padding: 0.25rem;
    padding-top: 0.25rem;
    position: relative;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}

@media (min-width: 768px) {
    .main-content {
        padding: 1.5rem;
        padding-top: 0.5rem;
    }
}
</style>
