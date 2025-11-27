<template>
    <BaseButton
        :variant="selected ? 'secondary' : 'outline-secondary'"
        :size="mobile ? 'xsmall' : 'small'"
        @click="emit('click', config.type)"
        :title="config.title"
        :disabled="disabled"
        >{{ config.label }}</BaseButton
    >
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { ItemTypeButtonProp, PalaverType } from "@/types/palaver";

const { mobile } = useDisplay();

withDefaults(
    defineProps<{
        config: ItemTypeButtonProp;
        selected: boolean;
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    }
);

const emit = defineEmits<{
    (e: "click", type: PalaverType): void;
}>();
</script>

<style scoped></style>
