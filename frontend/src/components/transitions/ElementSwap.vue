<template>
    <Transition name="element-swap" mode="out-in">
        <slot />
    </Transition>
</template>

<script setup lang="ts"></script>

<style scoped>
.element-swap-enter-active,
.progress-swap-leave-active {
    transition: all 200ms ease;
}
.element-swap-enter-from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
}
.element-swap-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.element-swap-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.element-swap-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
}
</style>
