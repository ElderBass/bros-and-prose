<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="say sumpin'"
        size="medium"
    >
        <PalaverComposer :closeModal="onClose" />
    </BaseModal>
</template>

<script setup lang="ts">
import PalaverComposer from "../features/Palaver/PalaverComposer.vue";

defineProps<{
    open: boolean;
    onClose: () => void;
}>();
</script>

<style scoped></style>
