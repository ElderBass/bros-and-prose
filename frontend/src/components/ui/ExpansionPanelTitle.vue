<template>
    <p class="expansion-panel-title" :class="`color-${color}`" :style="style">
        {{ title }}
    </p>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red";
        style?: string;
    }>(),
    {
        color: "blue",
        style: "",
    }
);
</script>

<style scoped>
.expansion-panel-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.5rem;
    transition: color 0.2s ease;
}

.color-blue {
    color: var(--accent-blue);
}

.color-fuschia {
    color: var(--accent-fuschia);
}

.color-green {
    color: var(--accent-green);
}

.color-lavender {
    color: var(--accent-lavender);
}

.color-red {
    color: var(--accent-red);
}
</style>
