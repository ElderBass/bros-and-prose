<template>
    <IconButton
        :disabled="disabled"
        :icon="faXmark"
        :size="mobile ? 'small' : 'medium'"
        color="red"
        title="clear search"
        type="button"
        :handleClick="onClick"
    />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import IconButton from "@/components/ui/IconButton.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

defineProps<{
    onClick: () => void;
    disabled?: boolean;
}>();

const { mobile } = useDisplay();
</script>
