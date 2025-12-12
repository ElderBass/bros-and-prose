<template>
    <v-expansion-panels
        :variant="variant"
        multiple
        class="expansions-panels"
        :class="{ multiple }"
    >
        <v-expansion-panel
            class="bro-expansion-panel"
            :class="`color-${color}`"
            :variant="variant"
            :elevation="elevation"
            :rounded="rounded"
            :bg-color="'transparent'"
            :expand-icon="ExpandIcon"
            :collapse-icon="CollapseIcon"
        >
            <v-expansion-panel-title>
                <slot name="title" />
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <slot name="text" />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup lang="ts">
import type { VExpansionPanel } from "vuetify/components";
import ExpandIcon from "../icons/ExpandIcon.vue";
import CollapseIcon from "../icons/CollapseIcon.vue";

withDefaults(
    defineProps<{
        variant?: "accordion" | "default" | "inset" | "popout";
        elevation?: number;
        rounded?: string | number;
        multiple?: boolean;
        color?: "blue" | "fuschia" | "green" | "lavender" | "red";
    }>(),
    {
        variant: "accordion",
        elevation: 0,
        rounded: "18px",
        multiple: false,
        color: "blue",
    }
);
</script>

<style scoped>
.expansions-panels {
    width: 100%;
    background: transparent;
}

:deep(.bro-expansion-panel) {
    border: 1px solid var(--accent-blue);
    background: rgba(18, 18, 41, 0.6);
    transition: border-color 0.2s ease;
    border-radius: 1rem;
}

:deep(.bro-expansion-panel.color-blue) {
    border-color: var(--accent-blue);
}

:deep(.bro-expansion-panel.color-fuschia) {
    border-color: var(--accent-fuschia);
}

:deep(.bro-expansion-panel.color-green) {
    border-color: var(--accent-green);
}

:deep(.bro-expansion-panel.color-lavender) {
    border-color: var(--accent-lavender);
}

:deep(.bro-expansion-panel.color-red) {
    border-color: var(--accent-red);
}

:deep(.bro-expansion-panel .v-expansion-panel-title__overlay) {
    background-color: transparent !important;
}

:deep(.bro-expansion-panel .v-expansion-panel-title) {
    padding: 0.85rem 1rem;
}

:deep(.bro-expansion-panel .v-expansion-panel-title__icon) {
    color: var(--accent-blue);
    opacity: 0.9;
    transition:
        color 0.2s ease,
        opacity 0.2s ease;
}

:deep(
    .bro-expansion-panel
        .v-expansion-panel-title--active
        .v-expansion-panel-title__icon
) {
    color: var(--accent-fuschia);
    opacity: 1;
}
</style>
