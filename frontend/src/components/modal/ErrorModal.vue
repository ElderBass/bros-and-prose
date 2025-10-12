<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="sucks to suck"
        size="large"
        shadowColor="red"
        :headerIcon="faHandMiddleFinger"
    >
        <div class="success-modal-content">
            <slot />
        </div>
        <template #footer>
            <BaseButton variant="outline-error" @click="onClose">
                get fucked
            </BaseButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { faHandMiddleFinger } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const onClose = () => {
    emit("close");
};
</script>

<style scoped>
.success-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem;
    height: 100%;
    width: 100%;
}
</style>
