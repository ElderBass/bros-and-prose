<template>
    <input
        class="base-input"
        :value="modelValue"
        @input="
            $emit(
                'update:modelValue',
                ($event.target as HTMLInputElement).value
            )
        "
        :aria-label="label"
        :placeholder="placeholder"
        :type="type"
        :disabled="disabled"
        :prepend-inner-icon="prependInnerIcon"
    />
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
    label: string;
    placeholder: string;
    type: string;
    disabled: boolean;
    prependInnerIcon: string;
}>();

defineEmits<{
    "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.base-input {
    width: 100%;
    height: 3rem;
    background-color: var(--background-color);
    color: var(--main-text);
    border: 2px solid var(--accent-blue);
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: "Crimson Text", serif;
    font-size: 1.5rem;
    font-weight: 400;

    &::placeholder {
        color: var(--main-text);
        opacity: 0.6;
    }

    &:focus {
        outline: none;
        border: 2px solid var(--accent-fuschia);
    }
}
</style>
