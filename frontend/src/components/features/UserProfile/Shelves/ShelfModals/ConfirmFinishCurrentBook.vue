<template>
    <BaseModal
        :modelValue="confirmFinishCurrentBookModalOpen"
        @close="closeModal"
        title="finish this book?"
        :size="modalSize"
        shadow-color="green"
        :header-icon="faFlagCheckered"
    >
        <LoadingSpinnerContainer
            v-if="loading"
            :size="mobile ? 'medium' : 'large'"
            message="updating god's plan..."
        />
        <div v-else class="content">
            <p>mark</p>
            <p class="book-title">
                {{ selectedBook?.title?.toUpperCase() || "THIS BOOK" }}
            </p>
            <p>
                as finished and send it to your
                <span class="shelf-name">have read</span> shelf?
            </p>
        </div>
        <template #footer>
            <div class="actions">
                <BaseButton
                    variant="outline"
                    title="nah, keep reading"
                    @click="closeModal"
                    v-bind="buttonProps"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="success"
                    title="yeah, wrap it up"
                    @click="handleFinish"
                    :disabled="loading || !selectedBook?.id"
                    v-bind="buttonProps"
                >
                    {{ loading ? "finishing..." : "yeah dawg" }}
                </BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { useLog } from "@/composables/useLog";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { useUIStore } from "@/stores/ui";
import { QUICK_ERROR } from "@/constants";

defineOptions({ name: "ConfirmFinishCurrentBook" });

const { mobile } = useDisplay();
const { finishCurrentlyReading } = useUserShelves();
const { error: logError, info } = useLog();
const { showAlert } = useUIStore();

const shelfModalStore = useShelfModalStore();
const { confirmFinishCurrentBookModalOpen, selectedBook } =
    storeToRefs(shelfModalStore);
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

const handleFinish = async () => {
    if (!selectedBook.value?.id) {
        console.error("Missing current book for finish operation");
        return;
    }

    try {
        loading.value = true;
        await finishCurrentlyReading(selectedBook.value.id);
        await info(`Finished ${selectedBook.value.title}`);
    } catch (error) {
        console.error("Error finishing current book:", error);
        await logError(`Error finishing current book: ${error}`);
        showAlert(
            QUICK_ERROR([
                "fucking goofed when finishing that book.",
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
