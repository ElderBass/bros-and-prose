<template>
    <IconButton
        v-bind="$attrs"
        :icon="faArrowRightToBracket"
        :size="computedButtonSize"
        :title="title"
        :handleClick="handleMove"
        color="green"
    />
</template>

<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const { mobile } = useDisplay();

const props = defineProps<{
    title: string;
    handleMove?: () => void;
    buttonSize?: "supersmall" | "xsmall" | "small" | "medium" | "large";
}>();

const computedButtonSize = computed(() => {
    return props.buttonSize || (mobile.value ? "xsmall" : "small");
});

const handleMove = () => props.handleMove?.();
</script>
