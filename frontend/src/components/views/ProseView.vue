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
import { ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseList from "@/components/features/Prose/ProseList.vue";
import ProseComposerModal from "@/components/features/Prose/ProseComposerModal.vue";
import type { ProseEntry } from "@/types";
import { useProseStore } from "@/stores/prose";
import { isGuestUser } from "@/utils";

const loading = ref(false);
const showComposerModal = ref(false);
const proseStore = useProseStore();

const handleEntryCreated = (entry: ProseEntry) => {
    proseStore.setEntries([entry, ...proseStore.entries]);
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

@media (max-width: 768px) {
    .title-row {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
