<template>
    <BaseModal
        :modelValue="confirmRemoveModalOpen"
        @close="closeModal"
        title="you sure bro?"
        :size="modalSize"
        shadow-color="red"
        :header-icon="faSurprise"
    >
        <div class="content">
            <p>sure you wanna remove</p>
            <p class="book-title">{{ selectedBook?.title.toUpperCase() }}</p>
            <p>from your {{ shelfDisplayName }} shelf?</p>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline"
                    title="on second thought this book is aight"
                    @click="closeModal"
                    v-bind="buttonProps"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="error"
                    title="fuck that book in particular"
                    @click="handleDelete"
                    :disabled="loading"
                    v-bind="buttonProps"
                >
                    {{ loading ? "removing..." : "fuck it" }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faSurprise } from "@fortawesome/free-solid-svg-icons";
import { useUserShelves } from "@/composables/useUserShelves";
import { useLog } from "@/composables/useLog";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useUIStore } from "@/stores/ui";
import { getShelfDisplayName } from "@/utils/bookshelfUtils";
import { QUICK_ERROR } from "@/constants";

const { mobile } = useDisplay();
const { removeFromWantToRead, removeFromHaveRead, removeFromCurrentlyReading } =
    useUserShelves();
const { error: logError } = useLog();
const { showAlert } = useUIStore();

const shelfModalStore = useShelfModalStore();
const { confirmRemoveModalOpen, selectedBook, selectedBookShelf } =
    storeToRefs(shelfModalStore);
const { closeModal, openBookActionSuccess } = shelfModalStore;

const loading = ref(false);

const shelfDisplayName = computed(() => {
    if (!selectedBookShelf.value) return "shelf";
    return getShelfDisplayName(selectedBookShelf.value);
});

const modalSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const buttonProps = computed(() => {
    return {
        size: mobile.value ? "small" : "medium",
        style: mobile.value ? { width: "100%" } : {},
    };
});

const handleDelete = async () => {
    if (!selectedBook.value || !selectedBookShelf.value) {
        console.error("Missing book or shelf for delete operation");
        return;
    }

    try {
        loading.value = true;
        if (selectedBookShelf.value === "wantToRead") {
            await removeFromWantToRead(selectedBook.value.id);
        } else if (selectedBookShelf.value === "currentlyReading") {
            await removeFromCurrentlyReading(selectedBook.value.id);
        } else {
            await removeFromHaveRead(selectedBook.value.id);
        }
        openBookActionSuccess(
            "remove",
            selectedBook.value,
            selectedBookShelf.value,
            `removed from your ${getShelfDisplayName(selectedBookShelf.value)} shelf`
        );
    } catch (error) {
        console.error("Error deleting book from shelf:", error);
        await logError(`Error deleting book from shelf: ${error}`);
        showAlert(
            QUICK_ERROR([
                "fucking goofed when removing that book.",
                (error as Error).message,
            ])
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
    width: 50%;
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
