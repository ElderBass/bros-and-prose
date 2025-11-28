<template>
    <div
        v-if="count > 0"
        class="count-badge"
        :class="[
            `count-badge--${color}`,
            { 'count-badge--child': isChildComment },
        ]"
    >
        <span class="count">{{ count }}</span>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        count: number;
        color: string;
        isChildComment?: boolean;
    }>(),
    {
        isChildComment: false,
    }
);
</script>

<style scoped>
.count-badge {
    position: absolute;
    top: -0.6rem;
    right: -0.6rem;
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
}

.count-badge--red {
    color: var(--accent-red);
}

.count-badge--blue {
    color: var(--accent-blue);
}

@media (max-width: 768px) {
    .count-badge {
        min-width: 0.95rem;
        height: 0.95rem;
        font-size: 0.65rem;
        padding: 0 0.15rem;
    }

    .count-badge--child {
        top: -0.45rem;
        right: -0.45rem;
        min-width: 0.75rem;
        height: 0.75rem;
        font-size: 0.5rem;
        border-width: 0.75px;
    }
}
</style>
