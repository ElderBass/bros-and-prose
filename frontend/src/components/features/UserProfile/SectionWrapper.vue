<template>
    <div class="section-wrapper">
        <h4>{{ sectionTitle }}</h4>
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    sectionTitle: string;
}>();
</script>

<style scoped>
.section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

h4 {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.9rem;
    color: var(--accent-blue);
    margin: 0;
    padding-left: 0.75rem;
    font-family: "Libre Baskerville", serif;
}

@media (min-width: 768px) {
    .section-wrapper {
        width: 50%;
    }
    h4 {
        font-size: 1.125rem;
    }
}
</style>
