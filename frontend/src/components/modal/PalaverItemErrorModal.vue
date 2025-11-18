<template>
    <ErrorModal :open="!!errorModalOpen" @close="closeModal">
        <p>fucking caught an error when {{ actionText }} that shit:</p>
        <p class="error-message">{{ errorMessage }}</p>
    </ErrorModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ErrorModal from "./ErrorModal.vue";
import type { PalaverErrorModal } from "@/stores/palaver";
import { storeToRefs } from "pinia";
import { usePalaverStore } from "@/stores/palaver";

const palaver = usePalaverStore();
const { modal, errorModalOpen } = storeToRefs(palaver);
const { closeModal } = palaver;

const errorMessage = computed(() => {
    return (modal.value as PalaverErrorModal)?.errorMessage;
});

const actionText = computed(() => {
    switch ((modal.value as PalaverErrorModal)?.action) {
        case "create":
            return "posting";
        case "update":
            return "updating";
        case "delete":
            return "deleting";
        default:
            return "doing";
    }
});
</script>

<style scoped>
p {
    text-align: center;
    font-size: 1.25rem;
    color: var(--main-text);
}
.error-message {
    font-size: 1rem;
    color: var(--accent-red);
}
</style>
