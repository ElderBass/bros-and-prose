<template>
    <Transition name="fade" mode="out-in">
        <slot />
    </Transition>
</template>

<script setup lang="ts"></script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
