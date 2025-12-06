<template>
    <ErrorModal :open="addBookErrorModalOpen" @close="closeModal">
        <p>fucking caught an error when {{ actionText }} that book:</p>
        <p v-if="message" class="error-message">{{ message }}</p>
        <p v-else class="error-message">something went wrong, bro</p>
    </ErrorModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ErrorModal from "@/components/modal/ErrorModal.vue";
import { useShelfModalStore } from "@/stores/shelfModal";
import { storeToRefs } from "pinia";
import { getErrorActionText } from "@/utils/bookshelfUtils";

const shelfModalStore = useShelfModalStore();
const { modal, addBookErrorModalOpen, message } = storeToRefs(shelfModalStore);

const { closeModal } = shelfModalStore;

const actionText = computed(() => getErrorActionText(modal.value));
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
