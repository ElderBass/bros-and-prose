<template>
    <BaseModal
        :modelValue="showReviewModal"
        @close="onClose"
        title="what'dya think, bro?"
        size="medium"
    >
        <RateAndReviewBookForm
            :currentBook="book"
            :rating="bookReview.rating || DEFAULT_RATING"
            :comment="bookReview.reviewComment || ''"
            :handleCancel="onClose"
            :handleSubmit="onReviewSubmit"
        />
    </BaseModal>
</template>

<script setup lang="ts">
import RateAndReviewBookForm from "@/components/form/RateAndReviewBookForm.vue";
import type { Book, SubmitReviewArgs } from "@/types";
import { DEFAULT_RATING } from "@/utils";

defineProps<{
    showReviewModal: boolean;
    book: Book;
    bookReview: SubmitReviewArgs;
    onReviewSubmit: (args: SubmitReviewArgs) => Promise<void>;
    onClose: () => void;
}>();
</script>

<style scoped></style>
