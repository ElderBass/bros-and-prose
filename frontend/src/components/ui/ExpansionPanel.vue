<template>
    <v-expansion-panels
        :variant="variant"
        multiple
        class="expansions-panels"
        :class="{ multiple }"
    >
        <v-expansion-panel
            class="bro-expansion-panel"
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
    }>(),
    {
        variant: "accordion",
        elevation: 0,
        rounded: "18px",
        multiple: false,
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
    margin-bottom: 0.5rem;
    transition: border-color 0.2s ease;
    border-radius: 1rem;
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
