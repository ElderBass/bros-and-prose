<template>
    <BaseModal
        :modelValue="showReviewModal"
        @close="onClose"
        title="what'dya think, bro?"
        size="medium"
    >
        <RateAndReviewBookForm
            :book="book"
            :rating="bookReview.rating || DEFAULT_RATING"
            :comment="bookReview.reviewComment || ''"
            :handleCancel="onClose"
            :handleSubmit="onReviewSubmit"
        />
    </BaseModal>
</template>

<script setup lang="ts">
import RateAndReviewBookForm from "@/components/form/RateAndReviewBookForm.vue";
import type { Book, FutureBook, SubmitReviewArgs } from "@/types";
import { DEFAULT_RATING } from "@/constants";

withDefaults(
    defineProps<{
        showReviewModal: boolean;
        book: Book | FutureBook;
        bookReview: SubmitReviewArgs;
        onReviewSubmit: (args: SubmitReviewArgs) => Promise<void>;
        onClose: () => void;
    }>(),
    {
        bookReview: () => ({
            bookId: "",
            rating: DEFAULT_RATING,
            reviewComment: "",
        }),
    }
);
</script>

<style scoped></style>
