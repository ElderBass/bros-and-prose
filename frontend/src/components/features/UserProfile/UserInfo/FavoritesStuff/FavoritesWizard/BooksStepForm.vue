<template>
    <div class="step-form">
        <h3 class="step-title">add favorite books</h3>
        <p class="step-description">
            share the books that mean the most to you (optional)
        </p>

        <div class="items-list">
            <div
                v-for="(book, index) in localBooks"
                :key="index"
                class="book-item"
            >
                <div class="book-inputs-container">
                    <div class="book-inputs">
                        <BaseInput
                            v-model="localBooks[index].title"
                            placeholder="Book title"
                            label="Title"
                            :size="inputSize"
                        />
                        <BaseInput
                            v-model="localBooks[index].author"
                            placeholder="Author name"
                            label="Author"
                            :size="inputSize"
                        />
                    </div>
                    <IconButton
                        :icon="faTrash"
                        :size="buttonSize"
                        color="red"
                        title="Remove book"
                        :handleClick="() => removeBook(index)"
                    />
                </div>
            </div>
        </div>

        <BaseButton
            variant="outline"
            color="blue"
            :size="buttonSize"
            :icon="faPlus"
            @click="addBook"
        >
            add another
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { BookshelfBook } from "@/types";
import { v4 as uuidv4 } from "uuid";

const { mobile } = useDisplay();

const props = defineProps<{
    modelValue: BookshelfBook[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: BookshelfBook[]): void;
}>();

interface SimpleBook {
    title: string;
    author: string;
}

const localBooks = ref<SimpleBook[]>([
    ...props.modelValue.map((b) => ({ title: b.title, author: b.author })),
]);

// Ensure at least one empty input
if (localBooks.value.length === 0) {
    localBooks.value.push({ title: "", author: "" });
}

const addBook = () => {
    localBooks.value.push({ title: "", author: "" });
};

const removeBook = (index: number) => {
    localBooks.value.splice(index, 1);
    if (localBooks.value.length === 0) {
        localBooks.value.push({ title: "", author: "" });
    }
};

const inputSize = computed(() => {
    return mobile.value ? "small" : "medium";
});

const buttonSize = computed(() => {
    return mobile.value ? "xsmall" : "small";
});

watch(
    localBooks,
    (newVal) => {
        // Filter out empty books and convert to BookshelfBook format
        const filtered = newVal
            .filter((b) => b.title.trim() !== "" && b.author.trim() !== "")
            .map(
                (b): BookshelfBook => ({
                    id: uuidv4(),
                    title: b.title.trim(),
                    author: b.author.trim(),
                    yearPublished: 1969,
                    pages: 0,
                    imageSrc: "",
                    description: "",
                    tags: [],
                })
            );
        emit("update:modelValue", filtered);
    },
    { deep: true }
);
</script>

<style scoped>
.step-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
}

.step-title {
    font-family: "Libre Baskerville", serif;
    font-size: 1.5rem;
    color: var(--accent-pink);
    margin: 0;
    text-transform: lowercase;
}

.step-description {
    font-size: 0.95rem;
    opacity: 0.8;
    margin: 0;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.book-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.book-inputs-container {
    width: 100%;
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.book-inputs {
    width: 100%;
    flex: 1;
    display: flex;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .book-item {
        flex-direction: column;
        gap: 0.5rem;
    }
    .book-inputs {
        flex-direction: column;
        gap: 0.25rem;
    }
}
</style>
