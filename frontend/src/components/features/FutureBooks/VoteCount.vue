<template>
    <div class="votes">
        <span class="count">{{ voteCount }}</span>
        <span class="label">votes</span>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        voteCount: number;
    }>(),
    {
        voteCount: 0,
    }
);
</script>

<style scoped>
.votes {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    font-size: 1.5rem;
    color: var(--accent-blue);
}

.count {
    font-weight: 700;
}

.label {
    opacity: 0.8;
}
</style>
