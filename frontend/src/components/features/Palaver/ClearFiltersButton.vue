<template>
    <IconButton
        :disabled="disabled"
        :icon="faXmark"
        :size="mobile ? 'small' : 'medium'"
        color="red"
        title="gimme all that juicy action"
        :handleClick="clearFilters"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import IconButton from "@/components/ui/IconButton.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { usePalaverStore } from "@/stores/palaver";

const { mobile } = useDisplay();
const { clearFilters } = usePalaverStore();
const { filters } = storeToRefs(usePalaverStore());

const disabled = computed(() => {
    return filters.value.length === 0;
});
</script>
