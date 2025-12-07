<template>
    <BaseModal
        :modelValue="confirmMoveModalOpen"
        @close="closeModal"
        title="move this book?"
        size="small"
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
                    :size="mobile ? 'small' : 'medium'"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="success"
                    title="yeah, move that shit"
                    @click="handleMove"
                    :disabled="loading"
                    :size="mobile ? 'small' : 'medium'"
                    :style="{ width: mobile ? '100%' : 'auto' }"
                >
                    {{ loading ? "moving..." : "send it" }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useLog } from "@/composables/useLog";

const { mobile } = useDisplay();
const { moveFromWantToReadToHaveRead } = useUserShelves();
const { error: logError } = useLog();

const shelfModalStore = useShelfModalStore();
const { confirmMoveModalOpen, selectedBook } = storeToRefs(shelfModalStore);
const { closeModal, openAddBookError } = shelfModalStore;

const loading = ref(false);

const handleMove = async () => {
    if (!selectedBook.value) {
        console.error("Missing book for move operation");
        return;
    }

    try {
        loading.value = true;
        await moveFromWantToReadToHaveRead(selectedBook.value);
        closeModal();
    } catch (error) {
        console.error("Error moving book:", error);
        await logError(`Error moving book: ${error}`);
        openAddBookError(
            selectedBook.value.title,
            "have read",
            `error moving ${selectedBook.value.title} to have read shelf: ${(error as Error).message}`
        );
    } finally {
        loading.value = false;
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
