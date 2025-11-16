<template>
    <AppLayout>
        <PageTitle title="palaver" />
        <div class="container">
            <div v-if="isGuestUser()" class="readonly-banner">
                you’re in read-only mode, bro — log in to stir the pot
            </div>

            <PalaverList />
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "@/components/layout/AppLayout.vue";
import PageTitle from "@/components/ui/PageTitle.vue";
import PalaverFab from "@/components/features/Palaver/PalaverFab.vue";
import PalaverItemModal from "@/components/modal/PalaverItemModal.vue";
import PalaverItemSuccessModal from "@/components/modal/PalaverItemSuccessModal.vue";
import PalaverItemErrorModal from "@/components/modal/PalaverItemErrorModal.vue";
import PalaverList from "@/components/features/Palaver/PalaverList.vue";
import type { PalaverSuccessModal, PalaverErrorModal } from "@/stores/palaver";
import { isGuestUser } from "@/utils";
import { IS_PALAVER_ENABLED } from "@/constants/palaver";
import { usePalaverStore } from "@/stores/palaver";
import { usePalaver } from "@/composables/usePalaver";

const { itemModalOpen, successModalOpen, errorModalOpen, modal } =
    storeToRefs(usePalaverStore());

const { openItemModal, closeModal } = usePalaverStore();

const openPalaverItemModal = () => openItemModal("create");

onMounted(async () => {
    await usePalaver().getPalaverEntries();
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
