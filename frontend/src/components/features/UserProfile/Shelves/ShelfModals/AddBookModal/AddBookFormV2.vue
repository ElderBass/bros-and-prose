<template>
    <BookForm
        mode="add"
        :titleLabel="shelfMessage"
        :searchByTitle="searchGoogleByTitle"
        :resultsTitle="'pick the right prose for ya, bro:'"
        :validation="{
            requireTags: false,
            requireDescription: false,
        }"
        :onSubmit="onSubmit"
    >
        <template #actions="{ canSubmit, loading, detailsVisible, back }">
            <FormActionsV2
                v-if="detailsVisible && !loading"
                :canSubmit="canSubmit"
                :shelfDisplayName="shelfDisplayName"
                @cancel="back"
            />
        </template>
    </BookForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBooks } from "@/composables/useBooks";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { capitalizeBookTitle, getShelfSuccessMessage } from "@/utils";
import type { BookshelfBook, Shelf, SubmitReviewArgs } from "@/types";
import { useLog } from "@/composables/useLog";
import type { BookFormValues } from "@/components/form/BookForm/types";
import FormActionsV2 from "../FormStuff/FormActionsV2.vue";
import { v4 as uuid } from "uuid";
import { EMPTY_SHELF_BOOK } from "@/constants";
import BookForm from "@/components/form/BookForm/index.vue";

defineOptions({ name: "AddBookFormV2" });

const props = defineProps<{
    selectedShelf: Shelf;
    shelfMessage: string;
    shelfDisplayName: string;
}>();

const emit = defineEmits<{
    (e: "submitting", submitting: boolean): void;
}>();

const { searchGoogleByTitle } = useBooks();
const { addToWantToRead, addToHaveRead, addToCurrentlyReading } =
    useUserShelves();
const { openBookActionSuccess, openAddBookError } = useShelfModalStore();

const formKey = ref(0);

const onSubmit = async (
    bookValues: BookFormValues,
    review?: SubmitReviewArgs
) => {
    try {
        emit("submitting", true);
        const year = Number.parseInt(bookValues.yearPublished.toString(), 10);
        const book: BookshelfBook = {
            id: uuid(),
            title: capitalizeBookTitle(bookValues.title),
            author: bookValues.author.trim(),
            yearPublished: Number.isFinite(year) ? year : 0,
            imageSrc: bookValues.imageSrc || "",
            pages: bookValues.pages,
            tags: bookValues.tags || [],
            description: bookValues.description.trim(),
        };

        if (props.selectedShelf === "wantToRead") {
            await addToWantToRead(book);
        } else if (props.selectedShelf === "haveRead") {
            await addToHaveRead(book, review);
        } else if (props.selectedShelf === "currentlyReading") {
            await addToCurrentlyReading(book);
        } else {
            throw new Error("Invalid shelf selected");
        }

        const message = getShelfSuccessMessage(props.selectedShelf);
        openBookActionSuccess("add", book, props.selectedShelf, message);
        formKey.value += 1; // reset BookForm state
    } catch (error) {
        console.error("error adding book to shelf", error);
        await useLog().error(`Error adding book to shelf: ${error}`);
        openAddBookError(
            EMPTY_SHELF_BOOK,
            props.selectedShelf,
            "error adding book to shelf: " + (error as Error).message
        );
    } finally {
        emit("submitting", false);
    }
};
</script>
