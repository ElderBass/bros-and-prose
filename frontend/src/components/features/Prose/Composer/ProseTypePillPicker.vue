<template>
    <div
        class="type-pill-group"
        role="radiogroup"
        :aria-labelledby="labelledBy"
    >
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            role="radio"
            :aria-checked="modelValue === option.value"
            class="type-pill-option"
            :class="[
                `type-${option.value}`,
                { selected: modelValue === option.value },
            ]"
            @click="emit('update:modelValue', option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup lang="ts">
import type { ProseType } from "@/types";

type TypeOption = { label: string; value: ProseType };

defineProps<{
    modelValue: ProseType;
    options: ReadonlyArray<TypeOption>;
    labelledBy: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: ProseType];
}>();
</script>

<style scoped>
.type-pill-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.type-pill-option {
    border: 1px solid transparent;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--main-text);
    text-transform: lowercase;
    font-size: 0.9rem;
    padding: 0.32rem 0.85rem;
    cursor: pointer;
    transition:
        transform 0.15s ease,
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.type-pill-option:hover {
    transform: translateY(-1px);
}

.type-pill-option.selected {
    font-weight: 600;
    transform: translateY(-1px);
}

.type-pill-option.type-creative {
    border-color: var(--accent-fuschia);
    color: var(--accent-fuschia);
}

.type-pill-option.type-academic {
    border-color: var(--accent-blue);
    color: var(--accent-blue);
}

.type-pill-option.type-poetic {
    border-color: var(--accent-lavender);
    color: var(--accent-lavender);
}

.type-pill-option.type-misc {
    border-color: var(--accent-green);
    color: var(--accent-green);
}

.type-pill-option.type-creative.selected {
    background: color-mix(in srgb, var(--accent-fuschia) 24%, transparent);
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-fuschia) 60%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-fuschia) 45%, transparent);
}

.type-pill-option.type-academic.selected {
    background: color-mix(in srgb, var(--accent-blue) 24%, transparent);
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-blue) 60%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-blue) 45%, transparent);
}

.type-pill-option.type-poetic.selected {
    background: color-mix(in srgb, var(--accent-lavender) 24%, transparent);
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-lavender) 60%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-lavender) 45%, transparent);
}

.type-pill-option.type-misc.selected {
    background: color-mix(in srgb, var(--accent-green) 24%, transparent);
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-green) 60%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-green) 45%, transparent);
}
</style>
