<template>
    <div class="input-section">
        <BaseInput
            id="non-book-favorite-input"
            v-model="currentInput"
            :label="label"
            :placeholder="placeholder"
            size="small"
            @keyup.enter="onAddItem"
        />
        <IconButton
            :icon="faPlus"
            color="green"
            :handleClick="onAddItem"
            :disabled="currentInput.length === 0"
            title="stack that shit"
            size="small"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    type: "author" | "genre";
    addItem: (item: string) => void;
}>();

const currentInput = ref("");

defineEmits<{
    (e: "update:currentInput", value: string): void;
}>();

const label = computed(() => {
    return `add favorite ${props.type}`;
});

const placeholder = computed(() => {
    return props.type === "author"
        ? "e.g., George Orwell"
        : "e.g., Science Fiction";
});

const onAddItem = () => {
    props.addItem(currentInput.value);
    currentInput.value = "";
};
</script>

<style scoped>
.input-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
}

.input-section :deep(.base-input) {
    flex: 1;
}

@media (max-width: 768px) {
    .input-section {
        gap: 0.5rem;
    }
}
</style>
