<template>
    <UserContentPanel
        title="prose"
        :noContentMessage="noContentMessage"
        :contentCount="proseEntries.length"
        scrollDirection="vertical"
        color="green"
    >
        <template #content>
            <ProseTable :entries="proseEntries" />
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ProseEntry } from "@/types";
import UserContentPanel from "./UserContentPanel.vue";
import ProseTable from "./ProseTable.vue";

const props = defineProps<{
    proseEntries: ProseEntry[];
    isLoggedInUser: boolean;
}>();

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "you haven't written shit yet."
        : "they haven't written shit."
);
</script>

<style scoped></style>
