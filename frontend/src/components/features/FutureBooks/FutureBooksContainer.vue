<template>
    <div class="future-books-container">
        <BaseButton
            v-if="hasAdminPrivileges() && ARCHIVE_ENABLED"
            @click="onArchiveClick"
            size="medium"
            variant="primary"
        >
            archive selections
        </BaseButton>
        <FutureBooksList v-if="futureBooks.length" :futureBooks="futureBooks" />
        <div v-else class="no-future-books">
            <p class="italics">no future books yet</p>
            <BaseButton
                v-if="hasReadWriteAccess"
                @click="openAddFutureBookModal"
                size="medium"
                variant="success"
            >
                <span>add a fucking book, already</span>
                <FontAwesomeIcon :icon="faBookMedical" />
            </BaseButton>
            <p v-else class="no-future-books-message">
                holla at your bro
                <span class="username">@{{ currentSelectorUsername }}</span>
                and get them to add a fucking book, already
            </p>
        </div>
    </div>
    <!-- TODO: do I have the "on deck" selector have their own list? -->
</template>

<script setup lang="ts">
import type { FutureBook } from "@/types";
import FutureBooksList from "./FutureBooksList.vue";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons";
import { hasAdminPrivileges } from "@/utils/hasAdminPrivileges";
import { useFutureBooks } from "@/composables/useFutureBooks";
import { useUIStore } from "@/stores/ui";
import { ARCHIVE_ENABLED } from "@/constants";

defineProps<{
    hasReadWriteAccess: boolean;
    currentSelectorUsername: string;
    futureBooks: FutureBook[];
    openAddFutureBookModal: () => void;
}>();

const onArchiveClick = async () => {
    try {
        useUIStore().setIsAppLoading(true);
        await useFutureBooks().archiveSelections();
        useUIStore().setIsAppLoading(false);
    } catch (error) {
        console.error("KERTWANGING error in onArchiveClick", error);
        useUIStore().setIsAppLoading(false);
    }
};
</script>

<style scoped>
.future-books-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    gap: 1rem;
    margin-top: 2rem;
}

.no-future-books {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 4rem;
    margin: 0 auto;
    border: 2px dashed var(--accent-blue);
    border-radius: 1rem;
    background: linear-gradient(
        180deg,
        rgba(0, 191, 255, 0.06),
        rgba(0, 191, 255, 0.03)
    );
    box-shadow:
        0 4px 20px rgba(0, 191, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    color: var(--main-text);
    width: 60%;
}

.no-future-books p {
    margin: 0;
    opacity: 0.85;
    width: 100%;
}

.italics {
    font-style: italic;
    font-size: 2rem;
}

.no-future-books-message {
    font-size: 1.5rem;
    font-style: normal;
    width: 100%;
}

@media (max-width: 768px) {
    .future-books-container {
        padding: 0rem;
        gap: 0.5rem;
    }
    .future-books-title {
        font-size: 1.25rem;
    }
    .no-future-books {
        width: 100%;
    }
    .no-future-books {
        width: 100%;
    }
    .italics {
        font-size: 1.5rem;
    }
    .no-future-books-message {
        font-size: 1.25rem;
    }
}
</style>
