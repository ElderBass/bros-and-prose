<template>
    <IconButton
        :icon="isFavorited ? faHeartSolid : faHeartRegular"
        :size="size"
        color="pink"
        shadowColor="pink"
        :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
        :handleClick="handleToggle"
    />
</template>

<script setup lang="ts">
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";

withDefaults(
    defineProps<{
        isFavorited: boolean;
        size?: "supersmall" | "xsmall" | "small" | "medium" | "large";
    }>(),
    {
        size: "xsmall",
    }
);

const emit = defineEmits<{
    (e: "toggle"): void;
}>();

const handleToggle = () => emit("toggle");
</script>
