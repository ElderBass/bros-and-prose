<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="say sumpin'"
        size="medium"
        :style="{ minHeight: '600px' }"
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

defineProps<{
    open: boolean;
    onClose: () => void;
}>();

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
