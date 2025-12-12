<template>
    <FontAwesomeIcon :icon="icon" :style="iconStyle" />
</template>

<script setup lang="ts">
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

defineProps<{
    icon: IconDefinition;
}>();

const iconStyle = {
    color: "var(--accent-blue)",
    fontSize: mobile ? "1rem" : "1.25rem",
    opacity: 0.9,
    transition: "color 0.2s ease, opacity 0.2s ease",
};
</script>
