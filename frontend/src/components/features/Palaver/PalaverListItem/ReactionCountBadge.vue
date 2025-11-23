<template>
    <div v-if="count > 0" class="count-badge" :class="`count-badge--${color}`">
        <span class="count">{{ count }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    count: number;
    color: string;
}>();
</script>

<style scoped>
.count-badge {
    position: absolute;
    top: -0.7rem;
    right: -0.7rem;
    min-width: 1.05rem;
    height: 1.05rem;
    border-radius: 999px;
    border: 1px solid currentColor;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    padding: 0 0.25rem;
}

.count-badge--green {
    color: var(--accent-green);
    /* box-shadow:
        0 0 8px rgba(57, 255, 20, 0.5),
        inset 0 0 4px rgba(57, 255, 20, 0.3); */
}

.count-badge--red {
    color: var(--accent-red);
    /* box-shadow:
        0 0 8px rgba(255, 0, 0, 0.5),
        inset 0 0 4px rgba(255, 0, 0, 0.3); */
}

@media (max-width: 768px) {
    .count-badge {
        top: -0.5rem;
        right: -0.5rem;
        min-width: 0.95rem;
        height: 0.95rem;
        font-size: 0.65rem;
        padding: 0 0.15rem;
    }
}
</style>
