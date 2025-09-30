<template>
    <h1 :style="style">{{ title }}</h1>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string;
        style?: string;
    }>(),
    {
        style: "",
    }
);
</script>

<style scoped>
h1 {
    font-size: 1.5rem;
    color: var(--main-text);
    border-bottom: 2px solid var(--accent-blue);
    font-weight: 600;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 0.25rem;
}

@media (min-width: 768px) {
    h1 {
        font-size: 1.75rem;
    }
}
</style>
