<template>
    <div class="simple-fav-form">
        <NonBookInput
            :type="type"
            :currentInput="currentInput"
            :addItem="addItem"
            @update:currentInput="currentInput = $event"
        />

        <SelectedItems :items="items" @removeItem="removeItem" />
        <FormActions :canSubmit="canSubmit" :submit="submit" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import NonBookInput from "./NonBookInput.vue";
import SelectedItems from "./SelectedItems.vue";
import FormActions from "./FormActions.vue";
import { capitalizeBookTitle } from "@/utils";

const { currentFavorites, type } = defineProps<{
    type: "author" | "genre";
    currentFavorites: string[];
}>();

const emit = defineEmits<{
    (e: "submit", items: string[]): void;
}>();

const currentInput = ref("");
const items = ref<string[]>([...currentFavorites]);

// Watch for changes in currentFavorites prop
watch(
    () => currentFavorites,
    (newFavorites) => {
        items.value = [...newFavorites];
    }
);

const canSubmit = computed(() => {
    return items.value.length > 0;
});

const addItem = (item: string) => {
    let itemToAdd = item;
    itemToAdd = itemToAdd.trim();
    if (type === "author") {
        itemToAdd = capitalizeBookTitle(itemToAdd);
    }
    items.value.push(itemToAdd);
    currentInput.value = "";
};

const removeItem = (index: number) => {
    items.value.splice(index, 1);
};

const submit = () => {
    if (canSubmit.value) {
        emit("submit", items.value);
    }
};
</script>

<style scoped>
.simple-fav-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .simple-fav-form {
        gap: 1.25rem;
    }
}
</style>
