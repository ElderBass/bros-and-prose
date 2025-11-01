<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="add a future book"
        size="large"
    >
        <LoadingSpinner
            v-if="isAppLoading"
            size="large"
            message="adding the future book..."
        />
        <FutureBookForm v-else :onSubmit="onSubmit" :closeModal="onClose" />
    </BaseModal>
</template>

<script setup lang="ts">
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import FutureBookForm from "@/components/form/FutureBookForm.vue";
import type { FutureBook } from "@/types";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";

const { isAppLoading } = storeToRefs(useUIStore());

const emit = defineEmits<{
    (e: "close"): void;
}>();

defineProps<{
    open: boolean;
    onSubmit: (futureBook: FutureBook, isEdit: boolean) => Promise<void>;
}>();

const onClose = () => emit("close");
</script>
