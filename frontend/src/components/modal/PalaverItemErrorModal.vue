<template>
    <ErrorModal :open="open" @close="onClose">
        <p>fucking caught an error when {{ actionText }} that shit:</p>
        <p class="error-message">{{ modal.errorMessage }}</p>
    </ErrorModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ErrorModal from "./ErrorModal.vue";
import type { PalaverErrorModal } from "@/stores/palaver";

const props = defineProps<{
    open: boolean;
    onClose: () => void;
    modal: PalaverErrorModal;
}>();

const actionText = computed(() => {
    switch (props.modal.action) {
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
