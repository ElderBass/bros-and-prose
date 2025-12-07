<template>
    <IconButton
        :icon="faTrash"
        :size="computedButtonSize"
        color="red"
        :title="title"
        :handleClick="handleDelete"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import IconButton from "@/components/ui/IconButton.vue";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const { mobile } = useDisplay();

const props = defineProps<{
    title: string;
    handleDelete: () => void;
    buttonSize?: "supersmall" | "xsmall" | "small" | "medium" | "large";
}>();

const computedButtonSize = computed(() => {
    return props.buttonSize || (mobile ? "xsmall" : "small");
});
</script>
