<template>
    <span class="notif-dot" aria-label="unread palaver items" />
</template>

<script setup lang="ts"></script>

<style scoped>
/* Notification dot */
.notif-dot {
    position: absolute;
    top: 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-green);
    box-shadow:
        0 0 6px var(--accent-green),
        0 0 12px var(--accent-green);
    animation: notif-pulse 2s ease-in-out infinite;
}
@keyframes notif-pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 0.9;
    }
    50% {
        transform: scale(1.4);
        opacity: 0.6;
    }
}

@media (prefers-reduced-motion: reduce) {
    .notif-dot {
        animation: none;
    }
}
</style>
