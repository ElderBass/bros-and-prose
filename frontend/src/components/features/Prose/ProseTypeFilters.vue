<template>
    <div class="filters-wrap">
        <BaseButton
            v-for="option in filterOptions"
            :key="option.value"
            :size="mobile ? 'xsmall' : 'small'"
            :variant="
                selectedFilter === option.value
                    ? 'secondary'
                    : 'outline-secondary'
            "
            :title="`filter by ${option.label}`"
            :showTooltip="false"
            @click="setFilter(option.value)"
        >
            {{ option.label }}
        </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useProseStore, type ProseFilter } from "@/stores/prose";

const { mobile } = useDisplay();
const proseStore = useProseStore();
const { selectedFilter } = storeToRefs(proseStore);
const { setFilter } = proseStore;

const filterOptions: Array<{ label: string; value: ProseFilter }> = [
    { label: "all", value: "all" },
    { label: "creative", value: "creative" },
    { label: "academic", value: "academic" },
    { label: "poetic", value: "poetic" },
    { label: "misc", value: "misc" },
];
</script>

<style scoped>
.filters-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.25rem 0;
}
</style>
