<template>
    <SuccessModal :open="!!successModalOpen" @close="closeModal">
        <p>your {{ itemTypeText }} has been {{ actionText }}</p>
        <p>it's part of god's plan now, my dude</p>
    </SuccessModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SuccessModal from "./SuccessModal.vue";
import { storeToRefs } from "pinia";
import type { PalaverSuccessModal } from "@/stores/palaver";
import { usePalaverStore } from "@/stores/palaver";

const palaver = usePalaverStore();
const { modal, successModalOpen } = storeToRefs(palaver);
const { closeModal } = palaver;

const actionText = computed(() => {
    switch ((modal.value as PalaverSuccessModal)?.action) {
        case "create":
            return "posted";
        case "update":
            return "updated";
        case "delete":
            return "deleted";
        default:
            return "posted";
    }
});

const itemTypeText = computed(() => {
    switch ((modal.value as PalaverSuccessModal)?.itemType) {
        case "discussion_note":
            return "book comment";
        case "recommendation":
            return "book rec";
        case "misc":
            return "bullshit";
        default:
            return "palaver item";
    }
});
</script>

<style scoped>
p {
    font-size: 1.25rem;
    color: var(--main-text);
}
</style>
