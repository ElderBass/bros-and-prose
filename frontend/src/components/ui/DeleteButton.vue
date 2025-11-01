<template>
    <IconButton
        :icon="faTrash"
        :size="mobile ? 'small' : 'medium'"
        color="red"
        :title="title"
        :handleClick="handleDelete"
    />
</template>

<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

defineProps<{
    title: string;
    handleDelete: () => void;
}>();
</script>
