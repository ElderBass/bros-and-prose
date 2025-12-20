<template>
    <div class="skeleton-stack" :style="[stackStyle]">
        <v-skeleton-loader
            v-for="n in count"
            :key="n"
            :type="type"
            :height="height"
            :width="width"
            :color="color"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        count?: number;
        type?: string;
        height?: number | string;
        width?: number | string;
        gapPx?: number;
        tone?: "blue" | "fuschia" | "green" | "lavender" | "red";
    }>(),
    {
        count: 4,
        type: "list-item-avatar-two-line",
        height: undefined,
        width: undefined,
        gapPx: 12,
        tone: "blue",
    }
);

const stackStyle = computed(() => ({
    gap: `${props.gapPx}px`,
}));

const color = computed(() => {
    switch (props.tone) {
        case "blue":
            return "rgba(0, 191, 255, 0.5)";
        case "fuschia":
            return "rgba(255, 0, 255, 0.5)";
        case "green":
            return "rgba(0, 255, 0, 0.5)";
        case "lavender":
            return "rgba(179, 136, 255, 0.5)";
        case "red":
            return "rgba(255, 0, 0, 0.5)";
        default:
            return "rgba(0, 191, 255, 0.5)";
    }
});
</script>

<style scoped>
.skeleton-stack {
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
