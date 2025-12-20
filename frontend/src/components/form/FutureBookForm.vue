<template>
    <BookForm
        :mode="bookFormMode"
        titleLabel="gimme the title"
        :searchDebounceMs="900"
        resultsTitle="beckon the future into the present..."
        :tagsLabel="'tags (required)'"
        :validation="{
            requireTags: true,
            requireDescription: true,
        }"
        :initialValues="initialValues"
        :onSubmit="onSubmitInternal"
        :dirtyKeys="['tags', 'description']"
    >
        <template #actions="{ canSubmit, loading, detailsVisible }">
            <div v-if="detailsVisible && !loading" class="form-actions">
                <BaseButton
                    variant="outline-secondary"
                    title="cancel"
                    type="button"
                    @click="props.closeModal"
                    v-bind="buttonProps"
                >
                    cancel
                </BaseButton>
                <BaseButton
                    variant="success"
                    type="submit"
                    title="submit future book"
                    :disabled="!canSubmit"
                    v-bind="buttonProps"
                >
                    submit
                </BaseButton>
            </div>
        </template>
    </BookForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { FutureBook } from "@/types";
import { v4 as uuid } from "uuid";
import { capitalizeBookTitle } from "@/utils";
import { storeToRefs } from "pinia";
import { useFutureBooksStore } from "@/stores/futureBooks";
import BookForm from "@/components/form/BookForm/index.vue";
import type { BookFormMode } from "@/components/form/BookForm/types";

const { mobile } = useDisplay();
const { modal } = storeToRefs(useFutureBooksStore());

const formModal = computed(() => {
    if (modal.value?.kind === "form" && modal.value.open) {
        return modal.value;
    }
    return null;
});

const props = defineProps<{
    onSubmit: (futureBook: FutureBook, isEdit: boolean) => Promise<void>;
    closeModal: () => void;
}>();

const isEdit = computed(() => Boolean(formModal.value?.futureBook?.id));
const bookFormMode = computed<BookFormMode>(() =>
    isEdit.value ? "future-edit" : "future"
);

const initialValues = computed(() => {
    if (isEdit.value && formModal.value?.futureBook) {
        return {
            title: formModal.value.futureBook.title || "",
            author: formModal.value.futureBook.author || "",
            yearPublished: String(
                formModal.value.futureBook.yearPublished || ""
            ),
            tags: formModal.value.futureBook.tags || [],
            description: formModal.value.futureBook.description || "",
            imageSrc: formModal.value.futureBook.imageSrc || "",
        };
    }
    return {};
});

const buttonProps = computed(() => ({
    size: mobile.value ? "small" : "medium",
    style: mobile.value ? { width: "100%" } : {},
}));

const onSubmitInternal = async (values: {
    title: string;
    author: string;
    yearPublished: string;
    pages?: number;
    tags: string[];
    description: string;
    imageSrc?: string;
}) => {
    const year = Number.parseInt(values.yearPublished, 10);

    let futureBookToSubmit: FutureBook;
    if (isEdit.value && formModal.value?.futureBook) {
        futureBookToSubmit = {
            ...formModal.value.futureBook,
            description: values.description,
            tags: values.tags,
        };
    } else {
        futureBookToSubmit = {
            id: uuid(),
            title: capitalizeBookTitle(values.title),
            author: values.author,
            description: values.description,
            yearPublished: Number.isFinite(year) ? year : 0,
            imageSrc: values.imageSrc || "",
            tags: values.tags,
            votes: ["placeholder"] as string[],
        };
    }

    await props.onSubmit(futureBookToSubmit, isEdit.value);
};
</script>

<style scoped>
.form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
}
@media (max-width: 786px) {
    .form-actions {
        justify-content: space-between;
        width: 100%;
    }
}
</style>
