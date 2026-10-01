<template>
    <ProseListItemV2
        v-if="useV2ProseListItem"
        :entry="entry"
        :compact="compact"
    />
    <ProseListItemV1 v-else :entry="entry" :compact="compact" />
</template>

<script setup lang="ts">
import type { ProseEntry } from "@/types";
import { useV2ProseListItem } from "@/constants/features";
import ProseListItemV1 from "./ProseListItemV1.vue";
import ProseListItemV2 from "./ProseListItemV2.vue";

defineProps<{
    entry: ProseEntry;
    compact?: boolean;
}>();
</script>
