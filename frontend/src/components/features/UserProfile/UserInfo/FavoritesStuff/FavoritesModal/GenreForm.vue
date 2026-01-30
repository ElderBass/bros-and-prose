<template>
    <NonBookForm
        type="genre"
        :currentFavorites="currentFavorites"
        @submit="submit"
        @cancel="cancel"
    />
</template>

<script setup lang="ts">
import NonBookForm from "./FormStuff/NonBookForm.vue";

defineProps<{
    currentFavorites: string[];
}>();

const emit = defineEmits<{
    (e: "submit", items: string[]): void;
    (e: "cancel"): void;
}>();

const submit = (items: string[]) => {
    emit("submit", items);
};
const cancel = () => {
    emit("cancel");
};
</script>
