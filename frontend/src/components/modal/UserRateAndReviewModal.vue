<template>
    <BaseModal
        :modelValue="open"
        @close="$emit('close')"
        title="what'dya think, bro?"
        size="medium"
    >
        <LoadingSpinnerContainer
            v-if="loadingMessage.length"
            size="medium"
            :message="loadingMessage"
        />
        <RateAndReviewBookForm
            v-else
            :book="book"
            :rating="bookReview.rating"
            :comment="bookReview.reviewComment"
            :tags="bookTags"
            :isFavorited="isFavorited"
            :showFavoriteToggle="true"
            @update="bookReview = $event"
            @update:tags="bookTags = $event"
            @update:isFavorited="isFavorited = $event"
            @cancel="$emit('close')"
            @submit="onReviewSubmit"
        />
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import RateAndReviewBookForm from "@/components/form/RateAndReviewBookForm.vue";
import type { Book, BookshelfBook, SubmitReviewArgs } from "@/types";
import {
    DEFAULT_REVIEW,
    SAVED_BOOK_CLUB_BOOK_SUCCESS_ALERT,
} from "@/constants";
import { useUser } from "@/composables/useUser";
import { useUserShelves } from "@/composables/useUserShelves";
import { useBooksStore } from "@/stores/books";
import { useUIStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";
import { isBookFavorite } from "@/utils";
import {
    getBookReviewDraft,
    setBookReviewDraft,
    clearBookReviewDraft,
} from "@/utils/localStorageUtils";

const { addReview } = useUser();
const { currentBook } = useBooksStore();
const { addCurrentBookClubBookToHaveRead } = useUserShelves();
const { showAlert } = useUIStore();
const { loggedInUser } = useUserStore();

const props = withDefaults(
    defineProps<{
        open: boolean;
        book: Book | BookshelfBook;
        reviewPrefill: SubmitReviewArgs;
    }>(),
    {
        reviewPrefill: () => DEFAULT_REVIEW,
    }
);

const emit = defineEmits<{
    close: [];
}>();

const loadingMessage = ref("");
const bookReview = ref(props.reviewPrefill);
const bookTags = ref<string[]>([]);
const isFavorited = ref(false);

const currentUserId = loggedInUser?.id ?? "";

let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const persistDraft = () => {
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
    draftSaveTimeout = setTimeout(() => {
        if (!currentUserId || !props.book?.id) return;
        setBookReviewDraft(props.book.id, currentUserId, {
            rating: bookReview.value.rating,
            reviewComment: bookReview.value.reviewComment,
            savedAt: new Date().toISOString(),
        });
    }, 350);
};

const restoreDraft = () => {
    if (!currentUserId || !props.book?.id) return;
    const draft = getBookReviewDraft(props.book.id, currentUserId);
    if (draft) {
        bookReview.value = {
            rating: draft.rating,
            reviewComment: draft.reviewComment,
        };
    }
};

watch(bookReview, persistDraft, { deep: true });

onMounted(() => {
    restoreDraft();
    isFavorited.value = isBookFavorite(props.book.id);
});

onBeforeUnmount(() => {
    if (draftSaveTimeout) clearTimeout(draftSaveTimeout);
});

const setLoadingMessage = (message: string) => {
    loadingMessage.value = message;
};

const onReviewSubmit = async () => {
    setLoadingMessage("submitting your shitty review...");
    const updatedUser = await addReview(bookReview.value, props.book);

    if (updatedUser) {
        bookReview.value = updatedUser.reviews[props.book.id];

        // Add book to Have Read shelf after successful review
        try {
            setLoadingMessage("edging towards god's plan...");
            await addCurrentBookClubBookToHaveRead(currentBook, bookTags.value);
            showAlert(SAVED_BOOK_CLUB_BOOK_SUCCESS_ALERT);
        } catch (error) {
            console.error("Error adding book to shelf:", error);
            showAlert({
                show: true,
                type: "error",
                messages: [
                    "review saved, but shelf update failed",
                    (error as Error).message,
                ],
                duration: 5000,
                dismissable: true,
            });
        }
    }

    clearBookReviewDraft(props.book.id, currentUserId);
    setLoadingMessage("");
    emit("close");
};
</script>
