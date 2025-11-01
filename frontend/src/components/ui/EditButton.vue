<template>
    <IconButton
        :icon="faMarker"
        :size="mobile ? 'small' : 'medium'"
        :title="title"
        :handleClick="handleEdit"
        color="fuschia"
    />
</template>

<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { faMarker } from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

defineProps<{
    title: string;
    handleEdit: () => void;
}>();
</script>
