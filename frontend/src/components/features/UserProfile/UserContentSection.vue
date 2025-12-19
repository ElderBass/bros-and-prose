<template>
    <div class="user-content-section">
        <h4 v-if="sectionTitle" class="section-title">{{ sectionTitle }}</h4>
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    sectionTitle?: string;
}>();
</script>

<style scoped>
.user-content-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
}

.section-title {
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.9rem;
    color: var(--accent-blue);
    margin: 0;
    padding-left: 0.75rem;
}

@media (min-width: 768px) {
    .section-title {
        font-size: 1.125rem;
    }
}
</style>
