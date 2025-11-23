<template>
    <BaseSelect
        :modelValue="props.modelValue.id"
        :options="options"
        id="palaver-item-book-select"
        label="choose a book"
        :showLabel="false"
        nullOption="choose a book"
        :size="mobile ? 'small' : 'large'"
        :disabled="props.disabled"
        @update:modelValue="onUpdate"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { useBooksStore } from "@/stores/books";
import { storeToRefs } from "pinia";
import { getBookByIdFromStore } from "@/utils";

const props = withDefaults(
    defineProps<{
        modelValue: { title: string; id: string };
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: { title: string; id: string }): void;
}>();

const booksStore = useBooksStore();
const { pastBooks, currentBook } = storeToRefs(booksStore);

const { mobile } = useDisplay();

const options = computed(() => {
    const pastBooksOptions = pastBooks.value.map((book) => ({
        label: book.title,
        value: book.id,
    }));
    return [
        {
            label: currentBook.value.title,
            value: currentBook.value.id,
        },
        ...pastBooksOptions,
    ];
});

const onUpdate = (value: string) => {
    const book = getBookByIdFromStore(value);
    if (!book) {
        throw new Error(`Book not found in store: ${value}`);
    }
    emit("update:modelValue", { title: book.title, id: book.id });
};

onMounted(() => {
    if (!props.modelValue?.id) {
        emit("update:modelValue", {
            title: currentBook.value.title,
            id: currentBook.value.id,
        });
    }
});

watch(
    () => props.modelValue.id,
    (id) => {
        if (!id && !props.disabled) {
            emit("update:modelValue", {
                title: currentBook.value.title,
                id: currentBook.value.id,
            });
        }
    }
);
</script>

<style scoped>
.book-select-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
