<template>
    <BaseModal
        :modelValue="!!itemModalOpen"
        @close="closeModal"
        title="say sumpin'"
        size="medium"
    >
        <div v-if="loading" class="loading-content">
            <LoadingSpinnerContainer
                :size="mobile ? 'medium' : 'large'"
                message="adding item to god's plan..."
            />
        </div>
        <PalaverComposer v-else :setLoading="setLoading" />
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import PalaverComposer from "../features/Palaver/PalaverComposer.vue";
import { storeToRefs } from "pinia";
import { usePalaverStore } from "@/stores/palaver";

const palaver = usePalaverStore();
const { itemModalOpen } = storeToRefs(palaver);

const { closeModal } = palaver;

const { mobile } = useDisplay();

const loading = ref(false);

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
