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
            @update="bookReview = $event"
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

const { addReview } = useUser();

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
const bookReview = ref(DEFAULT_REVIEW);

const setLoadingMessage = (message: string) => {
    loadingMessage.value = message;
};

const onReviewSubmit = async () => {
    setLoadingMessage("submitting your shitty review...");
    const udpatedUser = await addReview(bookReview.value, props.book);

    if (udpatedUser) {
        bookReview.value = udpatedUser.reviews[props.book.id];
    }
    setLoadingMessage("");
    emit("close");
};
</script>
