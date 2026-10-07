<template>
    <BaseCard :shadow-color="isMostVoted ? 'green' : 'lavender'" size="medium">
        <div class="future-book-item">
            <FutureBookItemInfo :book="book" />
            <div class="footer">
                <div class="metrics-and-actions">
                    <FutureBookVoters
                        :voterIds="book.votes || []"
                        :showVoteAction="showNonSelectorActions"
                        :userHasVoted="userHasVoted"
                        :isVoting="isVoting"
                        :handleVote="handleVote"
                    />
                    <div v-if="SHOW_ALREADY_READ" class="already-read-row">
                        <AlreadyReadCount
                            :alreadyReadCount="alreadyReadCount"
                            :usernames="alreadyReadUsernames"
                        />
                        <AlreadyReadActions
                            v-if="showNonSelectorActions"
                            :userHasMarkedRead="userHasMarkedRead"
                            :handleToggle="handleToggleRead"
                        />
                    </div>
                </div>
                <EditActions
                    v-if="userIsFutureBookSelector"
                    editTitle="fix your silly blurb, change the tags, etc."
                    deleteTitle="delete this drivel and choose something actually interesting"
                    :handleEdit="handleEdit"
                    :handleDelete="handleDelete"
                />
            </div>
        </div>
    </BaseCard>
    <DeleteFutureBookModal
        v-if="deleteFutureBookModalOpen"
        :open="deleteFutureBookModalOpen"
        :bookTitle="book.title"
        :bookId="book.id"
        @close="deleteFutureBookModalOpen = false"
    />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { QUICK_ERROR, futureBookVotedSuccessAlert } from "@/constants";
import FutureBookVoters from "./FutureBookVoters.vue";
import AlreadyReadCount from "./AlreadyReadCount.vue";
import AlreadyReadActions from "./AlreadyReadActions.vue";
import EditActions from "./EditActions.vue";
import FutureBookItemInfo from "./FutureBookItemInfo.vue";
import DeleteFutureBookModal from "@/components/modal/DeleteFutureBookModal.vue";
import type { FutureBook } from "@/types";
import { useUserStore } from "@/stores/user";
import { useFutureBooks } from "@/composables/useFutureBooks";
import { useUIStore } from "@/stores/ui";
import { useLog } from "@/composables/useLog";
import { useFutureBooksStore } from "@/stores/futureBooks";
import {
    isGuestUser,
    getUsernamesFromIds,
    hasUserMarkedAsRead,
    userHasVotedForBook,
} from "@/utils";

const SHOW_ALREADY_READ = false;

const props = defineProps<{
    book: FutureBook;
    isMostVoted: boolean;
}>();

const { userIsFutureBookSelector, loggedInUser } = useUserStore();
const { showAlert, setIsAppLoading } = useUIStore();
const { openFormModal } = useFutureBooksStore();

const deleteFutureBookModalOpen = ref(false);
const isVoting = ref(false);

const handleEdit = () => openFormModal(props.book, "update");
const handleDelete = () => (deleteFutureBookModalOpen.value = true);

const userHasVoted = computed(() =>
    userHasVotedForBook(props.book, loggedInUser.id)
);

const userHasMarkedRead = computed(() =>
    hasUserMarkedAsRead(props.book, loggedInUser.id)
);

const alreadyReadCount = computed(() => props.book.alreadyRead?.length || 0);

const alreadyReadUsernames = computed(() =>
    getUsernamesFromIds(props.book.alreadyRead || [])
);

const showNonSelectorActions = computed(
    () => !userIsFutureBookSelector && !isGuestUser()
);

const handleVote = async () => {
    if (isVoting.value) return;
    const hadVoted = userHasVoted.value;
    isVoting.value = true;
    try {
        await useFutureBooks().voteForFutureBook(
            props.book.id,
            loggedInUser.id
        );
        showAlert(futureBookVotedSuccessAlert(hadVoted));
    } catch (error) {
        await useLog().error(`Error voting for future book: ${error}`);
        showAlert(QUICK_ERROR(["voter fraud!", error as string]));
    } finally {
        isVoting.value = false;
    }
};

const handleToggleRead = async () => {
    try {
        setIsAppLoading(true);
        await useFutureBooks().toggleAlreadyRead(
            props.book.id,
            loggedInUser.id
        );
    } catch (error) {
        await useLog().error(`Error toggling already read: ${error}`);
        showAlert(QUICK_ERROR(["failed to update!", error as string]));
    } finally {
        useUIStore().setIsAppLoading(false);
    }
};
</script>

<style scoped>
.future-book-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    gap: 1rem;
}

.footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-top: auto;
}

.metrics-and-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.already-read-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
}

@media (max-width: 768px) {
    .future-book-item {
        gap: 0.5rem;
    }

    .footer {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }
}
</style>
