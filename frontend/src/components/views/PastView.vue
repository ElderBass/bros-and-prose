<template>
    <AppLayout>
        <PageTitle title="past prose don'tcha knows" />
        <PastBookList />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PastBookList from "../features/PastBooks/PastBookList.vue";
import PageTitle from "@/components/ui/PageTitle.vue";

onMounted(async () => {});
</script>

<style scoped>
.past-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
