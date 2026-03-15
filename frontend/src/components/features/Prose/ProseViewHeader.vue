<template>
    <div class="header-row">
        <BackButton :title="title" />
        <PageTitle :title="title" />
    </div>
</template>

<script setup lang="ts">
import BackButton from "@/components/ui/BackButton.vue";

defineProps<{
    title: string;
    backTarget: string;
}>();
</script>

<style scoped>
.header-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    color: var(--accent-blue);
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    padding: 0.5rem;
    text-decoration: none;
    transition:
        color 0.3s ease,
        background-color 0.3s ease,
        border-color 0.3s ease,
        transform 0.3s ease;
}

.back-link:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    border-color: var(--accent-fuschia);
    transform: scale(1.1);
}

.back-link:active {
    transform: scale(0.95);
}

.back-link:focus-visible {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}
</style>
