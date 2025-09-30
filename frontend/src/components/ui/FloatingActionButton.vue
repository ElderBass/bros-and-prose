<template>
    <div class="fab-container">
        <IconButton
            color="green"
            :icon="icon"
            :title="title"
            size="large"
            :style="style"
            :handleClick="() => $emit('click')"
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
    }>(),
    {
        size: "large",
        color: "green",
        style: () => ({}),
    }
);
</script>

<style scoped>
.fab-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
}
</style>
