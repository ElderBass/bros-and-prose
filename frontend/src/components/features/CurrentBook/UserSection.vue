<template>
    <div class="transition-container">
        <Transition name="fade" mode="out-in">
            <BaseCard
                key="progress-display"
                shadowColor="fuschia"
                size="medium"
            >
                <div class="card-header">
                    <h3>{{ cardHeader }}</h3>
                    <IconButton
                        v-if="hasFinishedBook"
                        title="you can't fix stupid, but I suppose you can try"
                        :icon="faMarker"
                        :size="isMobile ? 'small' : 'medium'"
                        :handleClick="() => setShowReviewModal(true)"
                    />
                </div>
                <LoadingSpinner
                    v-if="loadingMessage.length"
                    size="medium"
                    :message="loadingMessage"
                />
                <CurrentUserProgress
                    v-if="!hasFinishedBook && !loadingMessage.length"
                    :totalPages="book?.totalPages"
                    :setShowReviewModal="setShowReviewModal"
                    :handleUpdate="onUpdateProgress"
                />
                <CurrentBookUserReview
                    v-if="hasFinishedBook && !loadingMessage.length"
                    :rating="bookReview?.rating"
                    :comment="bookReview?.reviewComment"
                    :showReviewModal="() => setShowReviewModal(true)"
                />
            </BaseCard>
        </Transition>
    </div>
    <UserRateAndReviewModal
        v-if="showRateAndReviewModal"
        :showReviewModal="showRateAndReviewModal"
        :book="book"
        :bookReview="bookReview"
        :onReviewSubmit="onReviewSubmit"
        :onClose="() => setShowReviewModal(false)"
    />
    <AddCommentModal
        v-if="showAddCommentModal"
        :open="showAddCommentModal"
        :isProgressUpdate="true"
        @submit="onAddComment"
        @close="showAddCommentModal = false"
    />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CurrentUserProgress from "./UserProgress.vue";
import CurrentBookUserReview from "./UserReview.vue";
import UserRateAndReviewModal from "@/components/modal/UserRateAndReviewModal.vue";
import AddCommentModal from "@/components/modal/AddCommentModal.vue";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/stores/user";
import { watch, ref, computed, onMounted } from "vue";
import {
    DEFAULT_REVIEW,
    DEFAULT_RATING,
    FINISHED_BOOK_PROGRESS,
    UPDATE_PROGRESS_SUCCESS_ALERT,
} from "@/constants";
import type { Book, Comment, SubmitReviewArgs } from "@/types";
import { useUser } from "@/composables/useUser";
import { usePalaver } from "@/composables/usePalaver";
import { useUIStore } from "@/stores/ui";
import { buildPalaverEntry } from "@/utils";

const props = defineProps<{
    book: Book;
}>();

const { loggedInUser } = useUserStore();
const { addReview, updateUserProgress } = useUser();
const { createPalaverEntry } = usePalaver();

const uiStore = useUIStore();
const { showAlert } = uiStore;
const { isMobile } = storeToRefs(uiStore);

const loadingMessage = ref("");
const showRateAndReviewModal = ref(false);
const showAddCommentModal = ref(false);
const hasFinishedBook = ref(
    loggedInUser.currentBookProgress === FINISHED_BOOK_PROGRESS
);
const bookReview = ref({
    rating: DEFAULT_RATING,
    reviewComment: "",
});

watch(
    () => loggedInUser.currentBookProgress,
    (newProgress) => {
        hasFinishedBook.value = newProgress === FINISHED_BOOK_PROGRESS;
    }
);

watch(
    () => loggedInUser?.reviews[props.book?.id],
    (newReview) => {
        if (newReview) {
            bookReview.value = {
                rating: newReview?.rating || DEFAULT_RATING,
                reviewComment: newReview?.reviewComment || "",
            };
        } else {
            bookReview.value = DEFAULT_REVIEW;
        }
    },
    { deep: true, immediate: true }
);

onMounted(() => {
    bookReview.value = loggedInUser?.reviews[props.book?.id] || DEFAULT_REVIEW;
});

const setShowReviewModal = (show: boolean) => {
    showRateAndReviewModal.value = show;
};

const setShowAddCommentModal = (show: boolean) => {
    showAddCommentModal.value = show;
};

const onReviewSubmit = async ({ rating, reviewComment }: SubmitReviewArgs) => {
    setShowReviewModal(false);
    loadingMessage.value = "submitting your shitty review...";
    const udpatedUser = await addReview({ rating, reviewComment }, props.book);

    if (udpatedUser) {
        bookReview.value = udpatedUser.reviews[props.book.id];
    }
    loadingMessage.value = "";
    hasFinishedBook.value = true;
};

const onUpdateProgress = async (updatedProgress: number) => {
    loadingMessage.value = "updating your measly progress...";
    const udpatedUser = await updateUserProgress(
        loggedInUser.id,
        updatedProgress
    );
    loadingMessage.value = "";

    if (udpatedUser) {
        bookReview.value = udpatedUser.reviews[props.book.id];
    }

    if (updatedProgress === props.book.totalPages) {
        setShowReviewModal(true);
    } else {
        setShowAddCommentModal(true);
    }
};

const onAddComment = async (comment: Comment) => {
    setShowAddCommentModal(false);
    loadingMessage.value = "adding your comment...";
    const entry = buildPalaverEntry({
        type: "progress_note",
        text: comment.text,
        bookInfo: {
            title: props.book.title,
            author: props.book.author,
            id: props.book.id,
        },
    });
    await createPalaverEntry(entry);
    loadingMessage.value = "";
    showAlert(UPDATE_PROGRESS_SUCCESS_ALERT);
};

const cardHeader = computed(() => {
    return hasFinishedBook.value
        ? "your shitty review"
        : "your measly progress";
});
</script>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

h3 {
    font-size: 1.5rem;
    padding-bottom: 0.1rem;
    border-bottom: 2px solid var(--accent-blue);
}

.edit-review-button {
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    padding: 0.5rem;
    color: var(--accent-blue);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    width: 2rem;
    height: 2rem;
}

.edit-review-button:hover {
    color: var(--accent-fuschia);
    background-color: rgba(255, 77, 255, 0.1);
    transform: scale(1.1);
    border-color: var(--accent-fuschia);
}

.edit-review-button:focus {
    outline: 2px solid var(--accent-blue);
    outline-offset: 2px;
}

.transition-container {
    width: 100%;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

@media (min-width: 768px) {
    .edit-review-button {
        font-size: 1rem;
        width: 2.5rem;
        height: 2.5rem;
    }
}

@media (max-width: 768px) {
    h3 {
        font-size: 1.25rem;
    }
}
</style>
