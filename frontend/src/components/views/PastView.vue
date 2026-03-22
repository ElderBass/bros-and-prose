<template>
    <AppLayout>
        <PageHeader title="past prose in repose" />
        <PastBookList />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PastBookList from "../features/PastBooks/PastBookList.vue";

onMounted(async () => {});
</script>

<style scoped>
.past-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
