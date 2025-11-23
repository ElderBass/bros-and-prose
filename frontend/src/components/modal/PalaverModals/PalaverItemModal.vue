<template>
    <BaseModal
        :modelValue="!!itemModalOpen"
        @close="closeModal"
        :title="modalTitle"
        size="medium"
    >
        <div v-if="loading" class="loading-content">
            <LoadingSpinnerContainer
                :size="mobile ? 'medium' : 'large'"
                :message="loadingMessage"
            />
        </div>
        <PalaverComposer v-else :entry="entry" :setLoading="setLoading" />
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import PalaverComposer from "@/components/features/Palaver/PalaverComposer.vue";
import { usePalaverStore, type PalaverItemModal } from "@/stores/palaver";
import type { PalaverEntry } from "@/types";

const palaver = usePalaverStore();
const { itemModalOpen, modal } = storeToRefs(palaver);

const { closeModal } = palaver;

const { mobile } = useDisplay();

const loading = ref(false);

const modalTitle = computed(() => {
    return (modal.value as PalaverItemModal)?.action === "create"
        ? "say sumpin'"
        : "change sumpin'";
});

const loadingMessage = computed(() => {
    return (modal.value as PalaverItemModal)?.action === "create"
        ? "adding item to god's plan..."
        : "changing item in god's plan...";
});

const entry = computed(() => {
    return (modal.value as PalaverItemModal)?.entry || ({} as PalaverEntry);
});

const setLoading = (isLoading: boolean) => {
    loading.value = isLoading;
};
</script>

<style scoped>
.loading-content {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>
