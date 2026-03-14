<template>
    <AppLayout>
        <PageTitle title="prose details" />
        <div class="prose-detail-view">
            <p class="prose-id-label">prose id: {{ proseId }}</p>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";

const route = useRoute();
const proseId = computed(() => String(route.params.proseId || ""));
</script>

<style scoped>
.prose-detail-view {
    width: 100%;
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.prose-id-label {
    color: var(--accent-blue);
    font-size: 1.25rem;
}
</style>
