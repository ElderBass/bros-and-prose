<template>
    <div class="fab-container" :class="{ fixed: !draggable }">
        <IconButton
            color="green"
            :icon="icon"
            :title="title"
            size="large"
            :style="style"
            :handleClick="() => $emit('click')"
            :disabled="disabled"
            :openDelay="3000"
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
        draggable?: boolean;
    }>(),
    {
        size: "large",
        color: "green",
        style: () => ({}),
        disabled: false,
        draggable: false,
    }
);
</script>

<style scoped>
.fab-container {
    z-index: 100;
    background-color: var(--background-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
.fixed {
    position: fixed;
    bottom: 0;
    right: 0;
}
</style>
