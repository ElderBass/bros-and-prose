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
            :showFavoriteToggle="true"
            @update="bookReview = $event"
            @update:tags="bookTags = $event"
            @cancel="$emit('close')"
            @submit="onReviewSubmit"
        />
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RateAndReviewBookForm from "@/components/form/RateAndReviewBookForm.vue";
import type { Book, BookshelfBook, SubmitReviewArgs } from "@/types";
import { DEFAULT_REVIEW } from "@/constants";
import { useUser } from "@/composables/useUser";
import { useUserShelves } from "@/composables/useUserShelves";
import { useBooksStore } from "@/stores/books";
import { useUIStore } from "@/stores/ui";

const { addReview } = useUser();
const { currentBook } = useBooksStore();
const { addCurrentBookClubBookToHaveRead } = useUserShelves();
const { showAlert } = useUIStore();

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
            showAlert({
                show: true,
                type: "success",
                messages: [
                    "your silly review was saved",
                    "went ahead and added it to your past shelf. you're welcome.",
                ],
                duration: 3000,
                dismissable: false,
            });
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

    setLoadingMessage("");
    emit("close");
};
</script>
