<template>
    <BaseModal
        :modelValue="!!confirmDeleteModalOpen"
        @close="closeModal"
        title="confirm delete item"
        size="small"
        shadowColor="red"
    >
        <div class="content">
            <div v-if="loading" class="loading-content">
                <LoadingSpinnerContainer
                    :size="mobile ? 'medium' : 'large'"
                    message="altering god's plan..."
                />
            </div>
            <p v-else>send that shit into oblivion?</p>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline-error"
                    title="you lack conviction"
                    :size="buttonSize"
                    @click="closeModal"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="error"
                    title="fuck that shit"
                    :size="buttonSize"
                    @click="handleDelete"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    fuck it
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import LoadingSpinnerContainer from "@/components/ui/LoadingSpinnerContainer.vue";
import { usePalaver } from "@/composables/usePalaver";
import { usePalaverStore, type PalaverActionModal } from "@/stores/palaver";

const { mobile } = useDisplay();
const { deletePalaverEntry } = usePalaver();
const palaver = usePalaverStore();

const { closeModal, openSuccessModal, openErrorModal } = palaver;

const { modal, confirmDeleteModalOpen } = storeToRefs(palaver);
const loading = ref(false);

const handleDelete = async () => {
    try {
        loading.value = true;
        const { entry } = modal.value as PalaverActionModal;
        await deletePalaverEntry(entry.id);
        openSuccessModal(entry.type, "delete");
    } catch (error) {
        console.error(error);
        openErrorModal(error as string, "delete");
    } finally {
        loading.value = false;
    }
};

const buttonSize = computed(() => {
    return mobile.value ? "small" : "medium";
});
</script>

<style scoped>
.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
}

p {
    text-align: center;
    font-size: 1.5rem;
    color: var(--main-text);
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
@media (max-width: 768px) {
    p {
        font-size: 1.25rem;
    }
    .actions {
        padding: 0rem;
        justify-content: space-between;
        width: 100%;
        gap: 1rem;
    }
}
</style>
