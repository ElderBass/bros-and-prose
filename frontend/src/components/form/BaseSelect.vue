<template>
    <div class="base-select-container">
        <label v-if="showLabel" class="base-select-label" :for="id">{{
            label
        }}</label>
        <select
            :id="id"
            :value="modelValue"
            class="base-select"
            :class="`size-${size}`"
            :disabled="disabled"
            :style="style"
            aria-haspopup="listbox"
            @change="onChange"
        >
            <option
                v-for="option in renderedOptions"
                :key="option.label"
                :value="option.value"
            >
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        modelValue: string;
        options: {
            label: string;
            value: string;
        }[];
        id: string;
        label: string;
        showLabel?: boolean;
        nullOption?: string;
        disabled?: boolean;
        size?: "small" | "medium" | "large";
        style?: string;
    }>(),
    {
        showLabel: true,
        disabled: false,
        size: "large",
        style: "",
    }
);

const renderedOptions = computed(() => {
    const list = props.nullOption
        ? [{ label: props.nullOption, value: "" }, ...props.options]
        : props.options;
    return list.filter(Boolean);
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const onChange = (event: Event) => {
    emit("update:modelValue", (event.target as HTMLSelectElement)?.value);
};
</script>

<style scoped>
.base-select-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.base-select-label {
    color: var(--main-text);
    opacity: 0.9;
    font-size: 0.9rem;
    padding-left: 0.5rem;
}

.base-select {
    width: 100%;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    font-family: "Crimson Text", serif;
    font-weight: 400;
    appearance: none;
    background-image:
        linear-gradient(45deg, transparent 50%, var(--accent-blue) 50%),
        linear-gradient(135deg, var(--accent-blue) 50%, transparent 50%),
        linear-gradient(to right, transparent, transparent);
    background-position:
        calc(100% - 18px) calc(1em + 2px),
        calc(100% - 13px) calc(1em + 2px),
        100% 0;
    background-size:
        5px 5px,
        5px 5px,
        2.5em 2.5em;
    background-repeat: no-repeat;
}

.base-select:focus {
    outline: none;
    border: 2px solid var(--accent-lavender);
}

/* Disabled state */
.base-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    border-style: dashed;
    background-image: none;
}

/* Size variants */
.base-select.size-small {
    height: 2.5rem;
    padding: 0.5rem 1.5rem 0.5rem 0.75rem;
    font-size: 1rem;
}

.base-select.size-medium {
    height: 3rem;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 1.25rem;
}

.base-select.size-large {
    height: 4rem;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 1.5rem;
}
</style>
