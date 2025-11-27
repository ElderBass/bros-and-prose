<template>
    <BaseCard :shadow-color="isMostVoted ? 'green' : 'lavender'" size="medium">
        <div class="future-book-item">
            <FutureBookItemInfo :book="book" />
            <div class="footer">
                <VoteCount :voteCount="book.votes.length - 1 || 0" />
                <VoteActions
                    v-if="!userIsFutureBookSelector || isGuestUser()"
                    :voteCount="book.votes.length - 1 || 0"
                    :userHasVoted="userHasVoted"
                    :handleVote="handleVote"
                />
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
import { ref, watch } from "vue";
import { QUICK_ERROR, futureBookVotedSuccessAlert } from "@/constants";
import VoteCount from "./VoteCount.vue";
import VoteActions from "./VoteActions.vue";
import EditActions from "./EditActions.vue";
import FutureBookItemInfo from "./FutureBookItemInfo.vue";
import DeleteFutureBookModal from "@/components/modal/DeleteFutureBookModal.vue";
import type { FutureBook } from "@/types";
import { useUserStore } from "@/stores/user";
import { useFutureBooks } from "@/composables/useFutureBooks";
import { useUIStore } from "@/stores/ui";
import { useLog } from "@/composables/useLog";
import { useFutureBooksStore } from "@/stores/futureBooks";
import { isGuestUser } from "@/utils";

const props = defineProps<{
    book: FutureBook;
    isMostVoted: boolean;
}>();

const { userIsFutureBookSelector, loggedInUser } = useUserStore();
const { showAlert, setIsAppLoading } = useUIStore();
const { openFormModal } = useFutureBooksStore();

const deleteFutureBookModalOpen = ref(false);

const handleEdit = () => openFormModal(props.book, "update");
const handleDelete = () => (deleteFutureBookModalOpen.value = true);

const userHasVoted = ref(props.book.votes.includes(loggedInUser.id));

const handleVote = async () => {
    try {
        setIsAppLoading(true);
        await useFutureBooks().voteForFutureBook(
            props.book.id,
            loggedInUser.id
        );
    } catch (error) {
        await useLog().error(`Error voting for future book: ${error}`);
        showAlert(QUICK_ERROR(["voter fraud!", error as string]));
    } finally {
        useUIStore().setIsAppLoading(false);
        showAlert(futureBookVotedSuccessAlert(userHasVoted.value));
    }
};

watch(props.book.votes, (newVotes) => {
    userHasVoted.value = newVotes.includes(loggedInUser.id);
});
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
    align-items: center;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .future-book-item {
        gap: 0.5rem;
    }
}
</style>
