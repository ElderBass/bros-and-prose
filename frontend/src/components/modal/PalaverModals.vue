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
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import PalaverItemModal from "./PalaverItemModal.vue";
import PalaverItemSuccessModal from "@/components/modal/PalaverItemSuccessModal.vue";
import PalaverItemErrorModal from "@/components/modal/PalaverItemErrorModal.vue";
import { usePalaverStore } from "@/stores/palaver";

const palaver = usePalaverStore();
const { itemModalOpen, successModalOpen, errorModalOpen } =
    storeToRefs(palaver);
const { closeModal } = palaver;
</script>
