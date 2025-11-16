<template>
    <BaseButton
        size="small"
        :variant="filterValue === 'all' ? 'primary' : 'outline-secondary'"
        @click="setFilter(filterValue)"
        :style="{ flex: '1 0 20%' }"
        >{{ filterLabel }}</BaseButton
    >
</template>

<script setup lang="ts">
import { usePalaverStore, type PalaverFilter } from "@/stores/palaver";

const { setFilter } = usePalaverStore();

defineProps<{
    filterValue: PalaverFilter;
    filterLabel: string;
}>();
</script>
