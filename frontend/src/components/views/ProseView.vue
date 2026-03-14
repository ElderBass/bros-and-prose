<template>
    <AppLayout>
        <div class="title-row">
            <PageTitle title="prose from the bros" />
            <BaseButton
                v-if="!isGuestUser()"
                variant="outline-secondary"
                size="small"
                title="write a prose piece"
                :showTooltip="false"
                @click="showComposerModal = true"
            >
                push some prose
            </BaseButton>
        </div>
        <div v-if="loading" class="spinner-wrap">
            <LoadingSpinnerContainer
                size="large"
                message="cranking out the latest prose..."
            />
        </div>
        <div v-else class="prose-view">
            <ProseList />
        </div>

        <ProseComposerModal
            v-if="showComposerModal"
            :open="showComposerModal"
            @close="showComposerModal = false"
            @created="handleEntryCreated"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseList from "@/components/features/Prose/ProseList.vue";
import ProseComposerModal from "@/components/features/Prose/ProseComposerModal.vue";
import { useProse } from "@/composables/useProse";
import type { ProseEntry } from "@/types";
import { useProseStore } from "@/stores/prose";
import { isGuestUser } from "@/utils";

const loading = ref(false);
const showComposerModal = ref(false);
const proseStore = useProseStore();

const handleEntryCreated = (entry: ProseEntry) => {
    proseStore.setEntries([entry, ...proseStore.entries]);
};

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

.title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.spinner-wrap {
    width: 100%;
    min-height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media (max-width: 768px) {
    .title-row {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
