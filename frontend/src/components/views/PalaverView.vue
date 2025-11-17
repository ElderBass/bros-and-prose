<template>
    <AppLayout>
        <PageTitle title="palaver feed" />
        <div class="container">
            <LoadingSpinnerContainer
                v-if="loading"
                size="large"
                message="retrieving the latest bros buzz..."
            />
            <PalaverList v-else />
        </div>
        <PalaverFab
            v-if="!isGuestUser() && IS_PALAVER_ENABLED"
            @click="openPalaverItemModal"
        />
        <PalaverItemModal
            v-if="itemModalOpen"
            :open="itemModalOpen"
            :onClose="closeModal"
        />
        <PalaverItemSuccessModal
            v-if="successModalOpen"
            :open="successModalOpen"
            :onClose="closeModal"
            :modal="modal as PalaverSuccessModal"
        />
        <PalaverItemErrorModal
            v-if="errorModalOpen"
            :open="errorModalOpen"
            :onClose="closeModal"
            :modal="modal as PalaverErrorModal"
        />
    </AppLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import PalaverFab from "@/components/features/Palaver/PalaverFab.vue";
import PalaverItemModal from "@/components/modal/PalaverItemModal.vue";
import PalaverItemSuccessModal from "@/components/modal/PalaverItemSuccessModal.vue";
import PalaverItemErrorModal from "@/components/modal/PalaverItemErrorModal.vue";
import PalaverList from "@/components/features/Palaver/PalaverList.vue";
import type { PalaverSuccessModal, PalaverErrorModal } from "@/stores/palaver";
import { isGuestUser, setLastUnreadPalaverEntry } from "@/utils";
import { IS_PALAVER_ENABLED } from "@/constants/palaver";
import { usePalaverStore } from "@/stores/palaver";
import { usePalaver } from "@/composables/usePalaver";
import LoadingSpinnerContainer from "../ui/LoadingSpinnerContainer.vue";

const palaver = usePalaverStore();

const { itemModalOpen, successModalOpen, errorModalOpen, modal } =
    storeToRefs(palaver);
const loading = ref(false);

const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
};

const { openItemModal, closeModal, setHasUnreadEntries } = palaver;

const openPalaverItemModal = () => openItemModal("create");

onMounted(async () => {
    setLoading(true);
    const entries = await usePalaver().getPalaverEntries();
    setHasUnreadEntries(false);
    setLastUnreadPalaverEntry(entries[0].id);
    setLoading(false);
});
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
    height: 100%;
    flex-direction: column;
    gap: 1rem;
}
.composer-wrap {
    margin-bottom: 0.75rem;
}
.readonly-banner {
    margin: 0.5rem 0 1rem;
    padding: 0.5rem 0.75rem;
    border: 2px dashed var(--accent-blue);
    border-radius: 0.75rem;
    background: rgba(0, 191, 255, 0.06);
}
</style>
