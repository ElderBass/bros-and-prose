<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="huge fucking W"
        size="small"
        shadowColor="green"
        :headerIcon="faHandPeace"
    >
        <div class="success-modal-content">
            <slot />
        </div>
        <template #footer>
            <div class="button-container">
                <BaseButton variant="outline-success" @click="onClose">
                    hell yeah
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { faHandPeace } from "@fortawesome/free-solid-svg-icons";

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
    padding: 2rem;
}

p {
    text-align: center;
    font-size: 1.55rem;
    color: var(--main-text);
}
</style>
