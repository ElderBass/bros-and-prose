<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="add a future book"
        size="large"
    >
        <AddFutureBookForm :onSubmit="onSubmit" :closeModal="onClose" />
    </BaseModal>
</template>

<script setup lang="ts">
import AddFutureBookForm from "@/components/form/AddFutureBookForm.vue";
import type { FutureBook } from "@/types";
import { useBooks } from "@/composables/useBooks";
import { useLog } from "@/composables/useLog";
import { FUTURE_BOOK_ADDED_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";
import { useUIStore } from "@/stores/ui";

const { showAlert } = useUIStore();

const emit = defineEmits<{
    (e: "close"): void;
}>();

defineProps<{
    open: boolean;
}>();

const { addFutureBook } = useBooks();

const onClose = () => emit("close");

const onSubmit = async (futureBook: FutureBook) => {
    try {
        useUIStore().setIsAppLoading(true);
        await addFutureBook(futureBook);
        showAlert(FUTURE_BOOK_ADDED_SUCCESS_ALERT);
    } catch (error) {
        console.error("error in onSubmit", error);
        await useLog().error(`Error in onSubmit: ${error}`);
        showAlert(
            QUICK_ERROR([
                "oof, bud, this error happend: ",
                (error as Error).message,
            ])
        );
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};
</script>
