<template>
    <div class="view-container">
        <slot />
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 1rem;
}

@media (max-width: 768px) {
    .view-container {
        padding: 0.5rem;
    }
}
</style>
