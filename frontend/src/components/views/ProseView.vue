<template>
    <AppLayout>
        <PageTitle title="prose from the bros" />
        <div v-if="loading" class="spinner-wrap">
            <LoadingSpinnerContainer
                size="large"
                message="pulling up the latest prose..."
            />
        </div>
        <div v-else class="prose-view">
            <ProseList />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseList from "@/components/features/Prose/ProseList.vue";
import { useProse } from "@/composables/useProse";

const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        await useProse().getProseEntries();
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.prose-view {
    width: 100%;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

.spinner-wrap {
    width: 100%;
    min-height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
