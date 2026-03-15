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
            <ProseList @edit="openComposerForEdit" />
        </div>

        <ProseComposerModal
            v-if="showComposerModal"
            :open="showComposerModal"
            :edit-entry="editingEntry"
            @close="closeComposer"
            @created="handleEntryCreated"
            @updated="handleEntryUpdated"
        />
        <ProseFab v-if="!isGuestUser()" @click="openComposerForNew" />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import ProseList from "@/components/features/Prose/ProseList.vue";
import ProseComposerModal from "@/components/features/Prose/ProseComposerModal.vue";
import ProseFab from "@/components/features/Prose/ProseFab.vue";
import type { ProseEntry } from "@/types";
import { useProseStore } from "@/stores/prose";
import { isGuestUser } from "@/utils";

const loading = ref(false);
const showComposerModal = ref(false);
const editingEntry = ref<ProseEntry | null>(null);
const proseStore = useProseStore();

const openComposerForNew = () => {
    editingEntry.value = null;
    showComposerModal.value = true;
};

const openComposerForEdit = (entry: ProseEntry) => {
    editingEntry.value = entry;
    showComposerModal.value = true;
};

const closeComposer = () => {
    showComposerModal.value = false;
    editingEntry.value = null;
};

const handleEntryCreated = (entry: ProseEntry) => {
    proseStore.setEntries([entry, ...proseStore.entries]);
};

const handleEntryUpdated = () => {
    editingEntry.value = null;
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
