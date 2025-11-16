<template>
    <div class="spinner-container">
        <LoadingSpinner :size="size" :message="message" />
    </div>
</template>

<script setup lang="ts">
import LoadingSpinner from "./LoadingSpinner.vue";

defineProps<{
    size: "small" | "medium" | "large";
    message: string;
}>();
</script>

<style scoped>
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>
