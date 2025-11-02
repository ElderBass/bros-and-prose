<template>
    <div class="fab-container">
        <IconButton
            color="green"
            :icon="icon"
            :title="title"
            size="large"
            :style="style"
            :handleClick="() => $emit('click')"
            :disabled="disabled"
        />
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import IconButton from "@/components/ui/IconButton.vue";
import type { CSSProperties } from "vue";

withDefaults(
    defineProps<{
        icon: IconDefinition;
        title: string;
        size?: "xsmall" | "small" | "medium" | "large";
        color?: "blue" | "fuschia" | "green" | "lavender";
        style?: CSSProperties;
        disabled?: boolean;
    }>(),
    {
        size: "large",
        color: "green",
        style: () => ({}),
        disabled: false,
    }
);
</script>

<style scoped>
.fab-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
    background-color: var(--background-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
</style>
