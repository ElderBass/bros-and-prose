<template>
    <AppLayout>
        <PageHeader title="past prose in repose" />
        <PastBookList />
        <ArchivesSection title="potential futures made past" />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PastBookList from "../features/PastBooks/PastBookList.vue";
import ArchivesSection from "../features/FutureBooks/ArchivesSection.vue";

onMounted(async () => {});
</script>

<style scoped>
.past-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
