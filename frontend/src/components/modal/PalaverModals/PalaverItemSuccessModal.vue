<template>
    <SuccessModal :open="!!successModalOpen" @close="closeModal">
        <p>your {{ itemTypeText }} was {{ actionText }}</p>
        <p>{{ secondaryMessage }}</p>
    </SuccessModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SuccessModal from "@/components/modal/SuccessModal.vue";
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

const secondaryMessage = computed(() => {
    switch ((modal.value as PalaverSuccessModal)?.action) {
        case "create":
            return "it's part of god's plan now, my dude";
        default:
            return "as written #godsplan";
    }
});
</script>

<style scoped>
p {
    text-align: center;
    font-size: 1.25rem;
    color: var(--main-text);
}
</style>
