<template>
    <BaseButton
        :variant="selected ? 'secondary' : 'outline-secondary'"
        :size="mobile ? 'xsmall' : 'small'"
        @click="emit('click', config.type)"
        :title="config.title"
        >{{ config.label }}</BaseButton
    >
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useDisplay } from "vuetify";
import type { ItemTypeButtonProp, PalaverType } from "@/types/palaver";

const { mobile } = useDisplay();

defineProps<{
    config: ItemTypeButtonProp;
    selected: boolean;
}>();

const emit = defineEmits<{
    (e: "click", type: PalaverType): void;
}>();
</script>

<style scoped></style>
