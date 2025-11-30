<template>
    <UserContentPanel
        title="palaver"
        :noContentMessage="noContentMessage"
        :hasContent="entries.length > 0"
        scrollDirection="vertical"
        color="fuschia"
    >
        <template #scroll-content>
            <div class="palaver-list">
                <PalaverListItem
                    v-for="entry in entries"
                    :key="entry.id"
                    :entry="entry"
                    :isInbrospection="true"
                />
            </div>
        </template>
    </UserContentPanel>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PalaverEntry } from "@/types/palaver";
import PalaverListItem from "@/components/features/Palaver/PalaverListItem/index.vue";
import UserContentPanel from "./UserContentPanel.vue";

const props = defineProps<{
    entries: PalaverEntry[];
    isLoggedInUser: boolean;
}>();

const noContentMessage = computed(() =>
    props.isLoggedInUser
        ? "no palaver yet — go drop some spicy takes."
        : "no palaver yet — you probably don't wanna hear what they bro have to say anyway."
);
</script>

<style scoped>
.palaver-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;
    height: 400px;
    overflow-y: auto;
}

@media (min-width: 768px) {
    .palaver-list {
        height: 540px;
    }
}
</style>
