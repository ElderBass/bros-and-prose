<template>
    <div class="base-textarea-container">
        <textarea
            :id="id"
            class="base-textarea"
            :value="modelValue"
            @input="onInput"
            :aria-label="label"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            :style="style"
        />
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

withDefaults(
    defineProps<{
        modelValue: string;
        label: string;
        placeholder: string;
        id: string;
        disabled?: boolean;
        rows?: number;
        style?: string | CSSProperties;
    }>(),
    {
        disabled: false,
        rows: 5,
        style: undefined,
    }
);

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const onInput = (e: Event) => {
    const el = e.target as HTMLTextAreaElement | null;
    emit("update:modelValue", el?.value ?? "");
};
</script>

<style scoped>
.base-textarea-container {
    position: relative;
    width: 100%;
}

.base-textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-family: "Crimson Text", serif;
    font-size: 1.125rem;
    color: var(--main-text);
    background-color: var(--background-color);
}

.base-textarea::placeholder {
    color: var(--main-text);
    opacity: 0.6;
}

.base-textarea:focus {
    outline: none;
    border: 2px solid var(--accent-lavender);
}
</style>
