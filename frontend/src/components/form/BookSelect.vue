<template>
    <BaseSelect
        :modelValue="modelValue"
        :options="options"
        id="palaver-item-book-select"
        label="choose a book"
        :showLabel="false"
        nullOption="choose a book"
        :size="mobile ? 'small' : 'large'"
        @update:modelValue="onUpdate"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { useBooksStore } from "@/stores/books";
import { storeToRefs } from "pinia";

defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const booksStore = useBooksStore();
const { pastBooks, currentBook } = storeToRefs(booksStore);

const { mobile } = useDisplay();

const options = computed(() => {
    const pastBooksOptions = pastBooks.value.map((book) => ({
        label: book.title,
        value: book.id,
    }));
    return [
        { label: currentBook.value.title, value: currentBook.value.id },
        ...pastBooksOptions,
    ];
});

const onUpdate = (value: string) => {
    emit("update:modelValue", value);
};
</script>

<style scoped>
.book-select-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
