<template>
    <IconButton
        title="reply to this cheeky comment"
        :size="size"
        color="lavender"
        :icon="faReply"
        :handleClick="handleReply"
    />
</template>

<script setup lang="ts">
import { faReply } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@/components/ui/IconButton.vue";

withDefaults(
    defineProps<{
        size?: "supersmall" | "xsmall" | "small" | "medium";
    }>(),
    {
        size: "small",
    }
);

const emit = defineEmits<{
    (e: "reply"): void;
}>();

const handleReply = () => emit("reply");
</script>
