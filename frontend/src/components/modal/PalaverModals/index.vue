<template>
    <PalaverItemModal
        v-if="itemModalOpen"
        :open="itemModalOpen"
        :onClose="closeModal"
    />
    <PalaverItemSuccessModal v-if="successModalOpen" />
    <PalaverItemErrorModal
        v-if="errorModalOpen"
        :open="errorModalOpen"
        :onClose="closeModal"
    />
    <ConfirmDeleteModal v-if="confirmDeleteModalOpen" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import PalaverItemModal from "@/components/modal/PalaverModals/PalaverItemModal.vue";
import PalaverItemSuccessModal from "@/components/modal/PalaverModals/PalaverItemSuccessModal.vue";
import PalaverItemErrorModal from "@/components/modal/PalaverModals/PalaverItemErrorModal.vue";
import ConfirmDeleteModal from "@/components/modal/PalaverModals/ConfirmDeleteModal.vue";
import { usePalaverStore } from "@/stores/palaver";

defineOptions({ name: "PalaverModals" });

const palaver = usePalaverStore();
const { closeModal } = palaver;

const {
    itemModalOpen,
    successModalOpen,
    errorModalOpen,
    confirmDeleteModalOpen,
} = storeToRefs(palaver);
</script>
