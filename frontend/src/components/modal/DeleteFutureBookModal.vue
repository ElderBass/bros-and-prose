<template>
    <BaseModal
        :modelValue="open"
        @close="onClose"
        title="you sure bro?"
        size="medium"
        shadowColor="red"
        :headerIcon="faSurprise"
    >
        <div class="content">
            <p>sure you wanna delete</p>
            <p class="book-title">{{ bookTitle.toUpperCase() }}</p>
            <p>as a future book?</p>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline"
                    title="on second thought this book is aight"
                    @click="onClose"
                    :size="mobile ? 'small' : 'medium'"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="outline-error"
                    title="fuck that book in particular"
                    @click="handleDelete"
                    :size="mobile ? 'small' : 'medium'"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    fuck it
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { faSurprise } from "@fortawesome/free-solid-svg-icons";
import { useBooks } from "@/composables/useBooks";
import { useLog } from "@/composables/useLog";
import { useBooksStore } from "@/stores/books";
import { useUIStore } from "@/stores/ui";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { deleteFutureBook } = useBooks();
const { setFutureBookResultModal } = useBooksStore();

const props = defineProps<{
    open: boolean;
    bookTitle: string;
    bookId: string;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const onClose = () => emit("close");

const handleDelete = async () => {
    try {
        useUIStore().setIsAppLoading(true);
        await deleteFutureBook(props.bookId);
        setFutureBookResultModal({
            show: true,
            type: "success",
            message: [props.bookTitle.toUpperCase(), "deleted successfully."],
        });
        onClose();
    } catch (error) {
        onClose();
        setFutureBookResultModal({
            show: true,
            type: "error",
            message: [
                `Error when deleting future book ${props.bookTitle.toUpperCase()}:`,
                error as string,
            ],
        });
        await useLog().error(`Error deleting future book: ${error as string}`);
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1rem;
    padding: 1rem;
}

p {
    text-align: center;
    font-size: 1.55rem;
    color: var(--main-text);
}

.book-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-blue);
}

.actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    gap: 1rem;
    padding: 1rem;
}

@media (max-width: 768px) {
    .content {
        padding: 2rem;
    }

    p {
        font-size: 1.25rem;
    }
    .book-title {
        font-size: 1.5rem;
    }
    .actions {
        padding: 0rem;
        justify-content: space-between;
        width: 100%;
    }
}
</style>
