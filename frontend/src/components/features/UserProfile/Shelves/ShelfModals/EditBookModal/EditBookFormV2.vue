<template>
    <form @submit.prevent="submit" class="form">
        <div class="form-container">
            <label for="edit-book-title" class="title-label">
                {{ shelfMessage }}
            </label>
            <div class="search-row">
                <BaseInput
                    v-model="title"
                    id="edit-book-title"
                    label="title"
                    size="medium"
                    placeholder="book title"
                    disabled
                />
                <ClearSearchButton :onClick="resetForm" :disabled="!isDirty" />
            </div>
        </div>

        <template v-if="!loading">
            <div class="form-row">
                <div class="form-container">
                    <label for="edit-book-author" class="label">author</label>
                    <BaseInput
                        v-model="author"
                        id="edit-book-author"
                        label="author"
                        size="medium"
                        placeholder="author"
                        disabled
                    />
                </div>
                <div class="year-and-pages-row">
                    <div class="form-container">
                        <label for="edit-book-year" class="label"
                            >year published</label
                        >
                        <BaseInput
                            v-model="yearPublished"
                            id="edit-book-year"
                            label="year published"
                            placeholder="year"
                            size="medium"
                            disabled
                        />
                    </div>
                    <div class="form-container">
                        <label for="edit-book-pages" class="label">pages</label>
                        <BaseInput
                            v-model="pages"
                            type="number"
                            id="edit-book-pages"
                            label="pages"
                            placeholder="pages"
                            size="medium"
                            disabled
                        />
                    </div>
                </div>
            </div>

            <div class="form-container">
                <TagPickerTrigger
                    v-model="tags"
                    label="tags"
                    variant="drawer"
                    :isEdit="true"
                />
            </div>

            <div class="form-container">
                <label for="edit-book-comment" class="label"
                    >comment (optional)</label
                >
                <BaseTextArea
                    v-model="comment"
                    id="edit-book-comment"
                    label="comment"
                    placeholder="add your thoughts about this book..."
                    :style="{ height: '120px' }"
                />
            </div>
        </template>

        <SkeletonLoader
            v-if="loading"
            :count="5"
            type="list-item-avatar-two-line"
            :height="76"
            tone="blue"
        />
        <FormActionsV2
            v-if="!loading"
            :canSubmit="canSubmit"
            :shelfDisplayName="shelfDisplayName"
            action="update"
            @cancel="closeModal"
        />
    </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserShelves } from "@/composables/useUserShelves";
import { useShelfModalStore } from "@/stores/shelfModal";
import { getShelfSuccessMessage } from "@/utils";
import type { BookshelfBook, Shelf } from "@/types";
import TagPickerTrigger from "@/components/form/TagPicker/TagPickerTrigger.vue";
import FormActionsV2 from "../FormStuff/FormActionsV2.vue";
import ClearSearchButton from "../FormStuff/ClearSearchButton.vue";
import SkeletonLoader from "@/components/ui/SkeletonLoader.vue";

defineOptions({ name: "EditBookFormV2" });

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

const loading = ref(false);

const title = ref("");
const author = ref("");
const yearPublished = ref("");
const pages = ref<number | undefined>(undefined);
const tags = ref<string[]>([]);
const comment = ref("");

onMounted(() => {
    title.value = props.book.title || "";
    author.value = props.book.author || "";
    yearPublished.value = props.book.yearPublished?.toString() || "";
    pages.value = props.book.pages;
    tags.value = Object.values(props.book.tags || []);
    comment.value = props.book.description || "";
});

const canSubmit = computed(() => {
    return (
        title.value.trim().length > 0 &&
        author.value.trim().length > 0 &&
        yearPublished.value.trim().length > 0
    );
});

const isDirty = computed(() => {
    const originalTags = props.book.tags || [];
    const originalComment = props.book.description || "";
    const originalPages = props.book.pages;

    return (
        JSON.stringify(tags.value) !== JSON.stringify(originalTags) ||
        comment.value !== originalComment ||
        pages.value !== originalPages
    );
});

const resetForm = () => {
    title.value = props.book.title || "";
    author.value = props.book.author || "";
    yearPublished.value = props.book.yearPublished?.toString() || "";
    pages.value = props.book.pages;
    tags.value = props.book.tags || [];
    comment.value = props.book.description || "";
};

const submit = async () => {
    try {
        loading.value = true;

        const year = Number.parseInt(yearPublished.value, 10);

        const updatedBook: BookshelfBook = {
            id: props.book.id,
            title: title.value,
            author: author.value,
            imageSrc: props.book.imageSrc,
            yearPublished: Number.isFinite(year) ? year : 0,
            pages: pages.value,
            tags: tags.value,
            description: comment.value,
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
        resetForm();
    } catch (error) {
        openAddBookError(
            props.book,
            props.selectedShelf,
            "error updating book: " + (error as Error).message
        );
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.form-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.search-row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
}

.year-and-pages-row {
    display: flex;
    gap: 1rem;
    width: 100%;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 160px;
}

.label {
    font-size: 1.25rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

.title-label {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

@media (max-width: 768px) {
    .form {
        gap: 0.75rem;
    }

    .title-label {
        font-size: 1.25rem;
    }

    .form-row {
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-size: 1.1rem;
    }
}
</style>
