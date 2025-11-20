<template>
    <BaseButton
        :size="mobile ? 'xsmall' : 'small'"
        :variant="isSelected ? 'primary' : 'outline-secondary'"
        @click="onClick(filterValue)"
        :style="{ flex: '1 0 auto' }"
        >{{ filterLabel }}</BaseButton
    >
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { storeToRefs } from "pinia";
import { usePalaverStore, type PalaverFilter } from "@/stores/palaver";
import { computed } from "vue";

const props = defineProps<{
    filterValue: PalaverFilter;
    filterLabel: string;
}>();

const { filters } = storeToRefs(usePalaverStore());
const { addFilter, removeFilter } = usePalaverStore();
const { mobile } = useDisplay();

const isSelected = computed(() => {
    return filters.value.includes(props.filterValue as PalaverFilter);
});

const onClick = (filter: PalaverFilter) => {
    if (isSelected.value) {
        removeFilter(filter);
    } else {
        addFilter(filter);
    }
};
</script>
