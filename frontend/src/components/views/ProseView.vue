<template>
    <AppLayout>
        <PageTitle title="prose from the bros" />
        <div v-if="loading" class="spinner-wrap">
            <LoadingSpinnerContainer
                size="large"
                message="cranking out the latest prose..."
            />
        </div>
        <div v-else class="prose-view">
            <ProseList @edit="goToEdit" />
        </div>

        <ProseFab v-if="!isGuestUser()" @click="goToNew" />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseList from "@/components/features/Prose/ProseList.vue";
import ProseFab from "@/components/features/Prose/ProseFab.vue";
import type { ProseEntry } from "@/types";
import { isGuestUser } from "@/utils";

const router = useRouter();
const loading = ref(false);

const goToNew = () => {
    router.push("/prose/new");
};

const goToEdit = (entry: ProseEntry) => {
    router.push(`/prose/edit/${entry.id}`);
};
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

.error-state {
    width: 100%;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    text-align: center;
}

.error-title {
    margin: 0;
    color: var(--accent-fuschia);
    font-size: 1.2rem;
}

.error-subtitle {
    margin: 0;
    color: var(--main-text);
    opacity: 0.82;
    font-size: 0.95rem;
}
</style>
