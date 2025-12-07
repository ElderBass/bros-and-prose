<template>
    <BaseModal
        :modelValue="confirmMoveModalOpen"
        @close="closeModal"
        title="move this book?"
        :size="modalSize"
        shadow-color="green"
        :header-icon="faArrowRight"
    >
        <div class="content">
            <p>send</p>
            <p class="book-title">{{ selectedBook?.title.toUpperCase() }}</p>
            <p>to your <span class="shelf-name">have read</span> shelf?</p>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline"
                    title="on second thought, keep it where it is"
                    @click="closeModal"
                    v-bind="buttonProps"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="success"
                    title="yeah, move that shit"
                    @click="handleMove"
                    :disabled="loading"
                    v-bind="buttonProps"
                >
                    {{ loading ? "moving..." : "send it" }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useLog } from "@/composables/useLog";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useUIStore } from "@/stores/ui";
import { MOVED_BOOK_SUCCESS_ALERT, QUICK_ERROR } from "@/constants";

const { mobile } = useDisplay();
const { moveFromWantToReadToHaveRead } = useUserShelves();
const { error: logError, info } = useLog();
const { showAlert } = useUIStore();

const shelfModalStore = useShelfModalStore();
const { confirmMoveModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const { closeModal } = shelfModalStore;

const loading = ref(false);

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: mobile.value ? { width: "100%" } : {},
    };
});

const modalSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const handleMove = async () => {
    if (!selectedBook.value) {
        console.error("Missing book for move operation");
        return;
    }

    try {
        loading.value = true;
        await moveFromWantToReadToHaveRead(selectedBook.value);
        await info(`Moved ${selectedBook.value.title} to have read shelf`);
        showAlert(MOVED_BOOK_SUCCESS_ALERT);
    } catch (error) {
        console.error("Error moving book:", error);
        await logError(`Error moving book: ${error}`);
        showAlert(
            QUICK_ERROR([
                "fucking goofed when moving that book.",
                (error as Error).message,
            ])
        );
    } finally {
        loading.value = false;
        closeModal();
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
    gap: 0.5rem;
    padding: 1rem;
}

p {
    text-align: center;
    font-size: 1.55rem;
    color: var(--main-text);
    margin: 0;
}

.book-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-blue);
}

.shelf-name {
    color: var(--accent-green);
    font-weight: 600;
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
        gap: 0.5rem;
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
