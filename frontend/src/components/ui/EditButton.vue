<template>
    <IconButton
        :icon="faMarker"
        :size="computedButtonSize"
        :title="title"
        :handleClick="handleEdit"
        color="fuschia"
    />
</template>

<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";
import { computed } from "vue";

const { mobile } = useDisplay();

const props = defineProps<{
    title: string;
    handleEdit: () => void;
    buttonSize?: "supersmall" | "xsmall" | "small" | "medium" | "large";
}>();

const computedButtonSize = computed(() => {
    return props.buttonSize || (mobile ? "small" : "medium");
});
</script>
