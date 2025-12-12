<template>
    <div class="fab-container" :class="{ fixed: !draggable }">
        <IconButton
            v-bind="$attrs"
            color="green"
            :icon="icon"
            :title="title"
            size="large"
            :style="style"
            :handleClick="
                (event?: MouseEvent) => {
                    if (!event) return;
                    // Call Vuetify's onClick handler if it exists (from menu props)
                    const onClickHandler = $attrs.onClick as
                        | ((event: MouseEvent) => void)
                        | undefined;
                    if (
                        onClickHandler &&
                        typeof onClickHandler === 'function'
                    ) {
                        onClickHandler(event);
                    }
                    // Emit our own click event
                    $emit('click', event);
                }
            "
            :disabled="disabled"
            :openDelay="3000"
        />
    </div>
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import IconButton from "@/components/ui/IconButton.vue";
import type { CSSProperties } from "vue";

defineOptions({ inheritAttrs: false });

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
    bottom: 1rem;
    right: 1rem;
}
</style>
