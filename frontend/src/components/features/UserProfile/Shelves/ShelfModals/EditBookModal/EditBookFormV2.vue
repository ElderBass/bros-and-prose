<template>
    <BookForm
        mode="edit"
        :titleLabel="shelfMessage"
        :initialValues="initialValues"
        :validation="{
            requireTags: false,
            requireDescription: false,
        }"
        :onSubmit="onSubmit"
        :dirtyKeys="['tags', 'description', 'pages']"
    >
        <template #actions="{ canSubmit, loading, detailsVisible }">
            <FormActionsV2
                v-if="detailsVisible && !loading"
                :canSubmit="canSubmit"
                :shelfDisplayName="shelfDisplayName"
                action="update"
                @cancel="closeModal"
            />
        </template>
    </BookForm>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfSuccessMessage } from "@/utils";
import type { BookshelfBook, Shelf } from "@/types";
import FormActionsV2 from "../FormStuff/FormActionsV2.vue";
import BookForm from "@/components/form/BookForm/index.vue";
import type { BookFormValues } from "@/components/form/BookForm/types";

const props = defineProps<{
    book: BookshelfBook;
    selectedShelf: Shelf;
    shelfMessage: string;
    shelfDisplayName: string;
}>();

const { updateWantToRead, updateHaveRead, updateCurrentlyReading } =
    useUserShelves();
const { openBookActionSuccess, openAddBookError, closeModal } =
    useShelfModalStore();

const formKey = ref(0);

const initialValues = computed(() => ({
    title: props.book.title || "",
    author: props.book.author || "",
    yearPublished: props.book.yearPublished?.toString() || "",
    pages: props.book.pages,
    tags: props.book.tags || [],
    description: props.book.description || "",
    imageSrc: props.book.imageSrc || "",
}));

const onSubmit = async (values: BookFormValues) => {
    try {
        const year = Number.parseInt(values.yearPublished.toString(), 10);

        const updatedBook: BookshelfBook = {
            id: props.book.id,
            title: values.title,
            author: values.author,
            imageSrc: props.book.imageSrc,
            yearPublished: Number.isFinite(year) ? year : 0,
            pages: values.pages,
            tags: values.tags,
            description: values.description,
        };

        if (props.selectedShelf === "wantToRead") {
            await updateWantToRead(updatedBook);
        } else if (props.selectedShelf === "haveRead") {
            await updateHaveRead(updatedBook);
        } else if (props.selectedShelf === "currentlyReading") {
            await updateCurrentlyReading(updatedBook);
        } else {
            throw new Error("Invalid shelf selected");
        }

        const message = getShelfSuccessMessage(props.selectedShelf);
        openBookActionSuccess(
            "update",
            updatedBook,
            props.selectedShelf,
            message
        );
        formKey.value += 1; // reset BookForm state to latest initialValues
    } catch (error) {
        openAddBookError(
            props.book,
            props.selectedShelf,
            "error updating book: " + (error as Error).message
        );
    }
};
</script>
