<template>
    <AppLayout>
        <PageTitle title="prose from the bros" />
        <div class="prose-view">
            <p class="coming-soon">building out the prose feed...</p>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
</script>

<style scoped>
.prose-view {
    width: 100%;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.coming-soon {
    color: var(--accent-lavender);
    font-size: 1.4rem;
}
</style>
