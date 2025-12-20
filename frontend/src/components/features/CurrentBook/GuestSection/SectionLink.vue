<template>
    <RouterLink class="router-link" :to="`/${type}`">
        <BaseButton
            :title="title"
            :variant="variant"
            :size="mobile ? 'small' : 'medium'"
            :style="{ width: '100%' }"
        >
            {{ title }}
        </BaseButton>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import type { SectionLinkType } from "./types";

const props = defineProps<{
    type: SectionLinkType;
}>();

const { mobile } = useDisplay();

const title = computed(() => {
    switch (props.type) {
        case "past":
            return "peer into the past";
        case "bros":
            return "browse the bros";
        case "palaver":
            return "peep the palaver";
        default:
            return "go to the page";
    }
});

const variant = computed(() => {
    switch (props.type) {
        case "past":
            return "outline-tertiary";
        case "bros":
            return "outline";
        case "palaver":
            return "outline-secondary";
        default:
            return "outline-tertiary";
    }
});
</script>

<style scoped>
.router-link {
    width: 100%;
}
</style>
