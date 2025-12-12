<template>
    <v-menu :content-class="menuContentClass" :location="location">
        <template #activator="{ props: menuProps }">
            <slot name="activator" :props="menuProps" />
        </template>
        <v-list>
            <slot name="items" />
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";

type AccentColor = "blue" | "fuschia" | "green" | "lavender" | "red";

type MenuLocation =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "start"
    | "end"
    | "top start"
    | "top end"
    | "bottom start"
    | "bottom end";

const props = withDefaults(
    defineProps<{
        accentColor?: AccentColor;
        hoverColor?: AccentColor;
        location?: MenuLocation;
    }>(),
    {
        accentColor: "blue",
        hoverColor: "lavender",
        location: "bottom start",
    }
);

const menuContentClass = computed(
    () =>
        `base-menu base-menu-${props.accentColor} base-menu-hover-${props.hoverColor}`
);
</script>

<style>
.base-menu {
    background-color: var(--background-color) !important;
    border: 2px solid var(--accent-blue) !important;
    border-radius: 1rem !important;
    z-index: 10;
    overflow: hidden;
}

.base-menu .v-menu .v-overlay__content {
    border-radius: 1rem !important;
}

.base-menu .v-list {
    background-color: transparent !important;
    padding: 0.25rem 0;
}

.base-menu .v-list-item {
    color: var(--accent-blue) !important;
    transition:
        background-color 0.2s ease,
        color 0.2s ease;
}

.base-menu .v-list-item:hover,
.base-menu .v-list-item:focus,
.base-menu .v-list-item--active {
    background-color: var(--accent-lavender) !important;
    color: var(--background-color) !important;
}

/* Accent color variants - border and text color */
.base-menu-fuschia {
    border-color: var(--accent-fuschia) !important;
}

.base-menu-fuschia .v-list-item {
    color: var(--accent-fuschia) !important;
}

.base-menu-green {
    border-color: var(--accent-green) !important;
}

.base-menu-green .v-list-item {
    color: var(--accent-green) !important;
}

.base-menu-red {
    border-color: var(--accent-red) !important;
}

.base-menu-red .v-list-item {
    color: var(--accent-red) !important;
}

.base-menu-lavender {
    border-color: var(--accent-lavender) !important;
}

.base-menu-lavender .v-list-item {
    color: var(--accent-lavender) !important;
}

.base-menu-blue {
    border-color: var(--accent-blue) !important;
}

.base-menu-blue .v-list-item {
    color: var(--accent-blue) !important;
}

/* Hover color variants - override default lavender hover */
.base-menu-hover-lavender .v-list-item:hover,
.base-menu-hover-lavender .v-list-item:focus,
.base-menu-hover-lavender .v-list-item--active {
    background-color: var(--accent-lavender) !important;
}

.base-menu-hover-fuschia .v-list-item:hover,
.base-menu-hover-fuschia .v-list-item:focus,
.base-menu-hover-fuschia .v-list-item--active {
    background-color: var(--accent-fuschia) !important;
}

.base-menu-hover-green .v-list-item:hover,
.base-menu-hover-green .v-list-item:focus,
.base-menu-hover-green .v-list-item--active {
    background-color: var(--accent-green) !important;
}

.base-menu-hover-blue .v-list-item:hover,
.base-menu-hover-blue .v-list-item:focus,
.base-menu-hover-blue .v-list-item--active {
    background-color: var(--accent-blue) !important;
}

.base-menu-hover-red .v-list-item:hover,
.base-menu-hover-red .v-list-item:focus,
.base-menu-hover-red .v-list-item--active {
    background-color: var(--accent-red) !important;
}
</style>
