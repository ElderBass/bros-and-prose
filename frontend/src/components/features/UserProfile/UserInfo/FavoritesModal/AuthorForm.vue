<template>
    <NonBookForm
        type="author"
        :currentFavorites="currentFavorites"
        @submit="submit"
    />
</template>

<script setup lang="ts">
import NonBookForm from "./FormStuff/NonBookForm.vue";

defineProps<{
    currentFavorites: string[];
}>();

const emit = defineEmits<{
    (e: "submit", items: string[]): void;
}>();

const submit = (items: string[]) => {
    emit("submit", items);
};
</script>
