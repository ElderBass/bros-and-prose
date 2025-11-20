<template>
    <IconButton
        :icon="faXmark"
        :size="mobile ? 'small' : 'medium'"
        color="red"
        title="gimme all that juicy action"
        :handleClick="clearFilters"
    />
</template>

<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDisplay } from "vuetify";
import { usePalaverStore } from "@/stores/palaver";

const { mobile } = useDisplay();
const { clearFilters } = usePalaverStore();
</script>
