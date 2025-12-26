<template>
    <div class="form-container">
        <label :for="`book-form-${mode}-title`" class="title-label">
            {{ resolvedTitleLabel }}
        </label>
        <div class="search-row">
            <BaseInput
                :modelValue="modelValue"
                :id="`book-form-${mode}-title`"
                label="title"
                size="medium"
                :placeholder="placeholder"
                :disabled="disabled"
                @update:modelValue="emit('update:modelValue', $event)"
            />
            <ClearSearchButton v-if="!disabled" :onClick="emitClear" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ClearSearchButton from "@/components/features/UserProfile/Shelves/ShelfModals/FormStuff/ClearSearchButton.vue";
import type { BookFormMode } from "./types";

const props = withDefaults(
    defineProps<{
        modelValue: string;
        mode: BookFormMode;
        titleLabel: string;
        noResults?: boolean;
        placeholder?: string;
        disabled?: boolean;
        clearDisabled?: boolean;
    }>(),
    {
        noResults: false,
        placeholder: "book title",
        disabled: false,
        clearDisabled: false,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "clear"): void;
}>();

const resolvedTitleLabel = computed(() => {
    if (props.noResults) return "book not found; you're on your own";
    return "search by title";
});

const emitClear = () => emit("clear");
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
}

.search-row {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
}

.title-label {
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--accent-blue);
    padding-left: 0.5rem;
}

@media (max-width: 768px) {
    .title-label {
        font-size: 1.25rem;
    }
}
</style>
